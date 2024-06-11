from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

from . import crud, models, schemas
from .database import SessionLocal, engine
from typing import Union
from .securityTesting import sqlinjection, bola


# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credential_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credential_exception
    return user

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid")
        token_data = schemas.TokenData(username=username)
        return token_data
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid")


@app.get("/token/verify")
async def verify_user_token(token_data: schemas.TokenData = Depends(verify_token)):
    return {"username": token_data.username}


@app.post("/user/create/", response_model=schemas.User)
def create_user(
    user: schemas.UserCreate, 
    db: Session = Depends(get_db)
    ):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/user/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/user/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/user/profile/", response_model=schemas.User)
async def read_user_profile(
    token_data: schemas.TokenData = Depends(verify_token), 
    db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=token_data.username)
    return db_user

@app.post("/security/create/", response_model=schemas.SecurityTestCase)
def create_security_test_case(
    security_test_case: schemas.SecurityTestCaseBase,
    token_data: schemas.TokenData = Depends(verify_token),
    db: Session = Depends(get_db)):
    db_security_test_case = crud.get_security_test_cases_by_name(db, name=security_test_case.name)
    if db_security_test_case:
        raise HTTPException(status_code=400, detail="Name already registered")
    return crud.create_security_test_case(db=db, security_test_case=security_test_case)

@app.get("/security/security_test_cases/", response_model=List[schemas.SecurityTestCase])
def read_security_test_cases(
    skip: int = 0, 
    limit: int = 100,
    token_data: schemas.TokenData = Depends(verify_token),
    db: Session = Depends(get_db)):
    security_test_cases = crud.get_security_test_cases(db, skip=skip, limit=limit)
    return security_test_cases

@app.get("/security/{security_test_case_id}", response_model=schemas.SecurityTestCase)
def read_security_test_case(
    security_test_case_id: int, 
    # token_data: schemas.TokenData = Depends(verify_token),
    db: Session = Depends(get_db)):
    db_security_test_case = crud.get_security_test_case(db, security_test_case_id=security_test_case_id)
    if db_security_test_case is None:
        raise HTTPException(status_code=404, detail="Security test case not found")
    return db_security_test_case

@app.post("/security/runTest/")
async def sql_injection(
    request: Request,
    token_data: schemas.TokenData = Depends(verify_token),
    db: Session = Depends(get_db)
    ):
    body = await request.json()
    url = body.get("url")
    id = body.get("id")

    db_security_test_case = crud.get_security_test_case(db, security_test_case_id=id)
    if db_security_test_case is None:
        raise HTTPException(status_code=404, detail="Security test case not found")
    
    if db_security_test_case.id == 14:
        result = sqlinjection.sql_injection(url, db_security_test_case.payload)
        return {"result": result, "url": url}
    if db_security_test_case.id == 17:
        result = bola.bola(url, db_security_test_case.payload)
        return {"result": result, "url": url}


    return {"result": id, "url": url}
