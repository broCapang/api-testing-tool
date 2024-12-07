from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import crud, models, schemas
from database import SessionLocal, engine
from typing import Union
from securityTesting import sqlinjection, bola
from reconTool.extractor import run_crawler

# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


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
async def run_security_test(
    request: Request,
    token_data: schemas.TokenData = Depends(verify_token),
    db: Session = Depends(get_db)
):
    body = await request.json()
    collection_id = body.get("collection_id")
    securitytest_id = body.get("securitytest_id")

    # Validate input
    if collection_id is None or securitytest_id is None:
        raise HTTPException(status_code=400, detail="collection_id and securitytest_id are required")

    # Fetch the test case
    db_security_test_case = crud.get_security_test_case(db, security_test_case_id=securitytest_id)
    if db_security_test_case is None:
        raise HTTPException(status_code=404, detail="Security test case not found")

    # Fetch the collection
    db_collection = crud.get_collection_by_id(db,collection_id=collection_id)
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")

    # Extract endpoints from the collection
    endpoints = db_collection.api_endpoints
    if not endpoints or not isinstance(endpoints, list):
        raise HTTPException(status_code=400, detail="No valid endpoints found in the collection")

    # Prepare results list
    test_results = []

    # Run the test against each endpoint in the collection
    for endpoint in endpoints:
        if db_security_test_case.id == 14:
            result = sqlinjection.sql_injection(endpoint, db_security_test_case.payload)
        elif db_security_test_case.id == 17:
            result = bola.bola(endpoint, db_security_test_case.payload)
        else:
            # For future tests or unknown test case IDs
            result = {"endpoint": endpoint, "status": "No test implemented"}

        # Append results to the list
        test_results.append({
            "endpoint": endpoint,
            "test_case_id": db_security_test_case.id,
            "result": result
        })

    return {
        "collection_id": collection_id,
        "securitytest_id": securitytest_id,
        "results": test_results
    }

@app.post("/crawl")
async def crawl(domain_request: schemas.DomainRequest, db: Session = Depends(get_db)):
    try:
        # Call the existing run_crawler function with the domain from the request
        result = await run_crawler(domain_request.domain)

        # Extract crawled URLs from the result
        api_endpoints = result.get("api_endpoints", [])

        # Create and store a new collection in the database
        collection_data = schemas.CollectionCreate(name=domain_request.name, api_endpoints=api_endpoints)
        new_collection = crud.create_collection(db=db, collection=collection_data)

        # Return the crawled URLs along with the stored collection info
        return {"name": new_collection.name, "api_endpoints": api_endpoints}
    
    except ValueError as e:
        # Handle invalid domain error
        raise HTTPException(status_code=400, detail=f"Invalid domain: {str(e)}")
    except Exception as e:
        # Handle any other errors
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/collections/", response_model=List[schemas.Collection])
def get_collections(db: Session = Depends(get_db)):
    collections = crud.get_collections(db=db)
    return collections


@app.get("/collections/{collection_id}", response_model=schemas.Collection)
def get_collection_by_id(collection_id: int, db: Session = Depends(get_db)):
    collection = crud.get_collection_by_id(db=db, collection_id=collection_id)
    if collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection