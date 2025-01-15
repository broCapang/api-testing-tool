from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Union
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

import crud, models, schemas
from database import SessionLocal, engine

# Example placeholders for test logic
# Just make sure your code has these or remove them as needed.
try:
    from securityTesting import sqlinjection, bola
except ImportError:
    # If not available, define placeholders
    class sqlinjection:
        @staticmethod
        def sql_injection(endpoint, payload):
            return True

    class bola:
        @staticmethod
        def bola(endpoint, payload):
            return False

try:
    from reconTool.extractor import run_crawler
except ImportError:
    async def run_crawler(domain: str):
        return {"api_endpoints": ["/api/v1", "/api/v2"]}

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "REPLACE_ME_SECRET")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Create DB tables if not exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#
# Database Dependency
#
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#
# JWT Helpers
#
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

#
# Auth Routes
#
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
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

@app.get("/token/verify")
async def verify_user_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid")

#
# User Routes
#
@app.post("/user/create/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/user/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@app.get("/user/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/user/profile/", response_model=schemas.User)
async def read_user_profile(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)):
    return current_user

#
# Security TestCase Routes
#
@app.post("/security/create/", response_model=schemas.SecurityTestCase)
def create_security_test_case(
    security_test_case: schemas.SecurityTestCaseBase,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_security_test_case = crud.get_security_test_cases_by_name(db, name=security_test_case.name)
    if db_security_test_case:
        raise HTTPException(status_code=400, detail="Name already registered")
    return crud.create_security_test_case(db=db, security_test_case=security_test_case)

@app.get("/security/security_test_cases/", response_model=List[schemas.SecurityTestCase])
def read_security_test_cases(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    return crud.get_security_test_cases(db, skip=skip, limit=limit)

@app.get("/security/{security_test_case_id}", response_model=schemas.SecurityTestCase)
def read_security_test_case(
    security_test_case_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_security_test_case = crud.get_security_test_case(db, security_test_case_id=security_test_case_id)
    if db_security_test_case is None:
        raise HTTPException(status_code=404, detail="Security test case not found")
    return db_security_test_case

#
# Collections Routes
#
@app.post("/collections/", response_model=schemas.Collection)
def create_a_collection(
    collection_data: schemas.CollectionCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    return crud.create_collection(db=db, collection=collection_data)

@app.get("/collections/", response_model=List[schemas.Collection])
def get_collections(db: Session = Depends(get_db)):
    return crud.get_collections(db=db)

@app.get("/collections/{collection_id}", response_model=schemas.Collection)
def get_collection_by_id(collection_id: int, db: Session = Depends(get_db)):
    collection = crud.get_collection_by_id(db=db, collection_id=collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

@app.delete("/collections/{collection_id}", response_model=schemas.Collection)
def delete_collection_by_id(collection_id: int, db: Session = Depends(get_db)):
    db_collection = crud.get_collection_by_id(db=db, collection_id=collection_id)
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    deleted_collection = crud.delete_collection(db=db, collection_id=collection_id)
    if not deleted_collection:
        raise HTTPException(status_code=500, detail="Failed to delete collection")
    return deleted_collection

#
# Example: Single Test
#
@app.post("/security/runTest/")
async def run_security_test(
    request: Request,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    body = await request.json()
    collection_id = body.get("collection_id")
    securitytest_id = body.get("securitytest_id")

    if collection_id is None or securitytest_id is None:
        raise HTTPException(status_code=400, detail="collection_id and securitytest_id are required")

    # Fetch the test case
    db_security_test_case = crud.get_security_test_case(db, security_test_case_id=securitytest_id)
    if db_security_test_case is None:
        raise HTTPException(status_code=404, detail="Security test case not found")

    # Fetch the collection
    db_collection = crud.get_collection_by_id(db, collection_id=collection_id)
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")

    # Extract endpoints from the collection
    endpoints = db_collection.api_endpoints
    if not endpoints or not isinstance(endpoints, list):
        raise HTTPException(status_code=400, detail="No valid endpoints found in the collection")

    # Prepare results list
    test_results = []

    # Run the test logic
    for endpoint in endpoints:
        if db_security_test_case.name.lower() == "sql injection":
            result = sqlinjection.sql_injection(endpoint, db_security_test_case.payload)
        elif db_security_test_case.name.lower() == "bola":
            result = bola.bola(endpoint, db_security_test_case.payload)
        else:
            result = {"endpoint": endpoint, "status": "No test implemented"}

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

#
# Example: Run All Tests
#
@app.post("/security/runAllTests/")
async def run_all_security_tests(
    request: Request,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    body = await request.json()
    collection_id = body.get("collection_id")

    if collection_id is None:
        raise HTTPException(status_code=400, detail="collection_id is required")

    # 1) Fetch the collection
    db_collection = crud.get_collection_by_id(db, collection_id=collection_id)
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")

    endpoints = db_collection.api_endpoints
    if not endpoints or not isinstance(endpoints, list):
        raise HTTPException(status_code=400, detail="No valid endpoints found in the collection")

    # 2) Fetch all security test cases
    security_test_cases = crud.get_security_test_cases(db)

    # 3) Create a single Assessment for this entire run
    #    (instead of a new Assessment for each endpoint)
    db_assessment = models.Assessment(collection_id=collection_id)
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)

    test_results = []

    # 4) For each endpoint, run all tests
    for endpoint in endpoints:
        test_3_passed = False
        test_4_passed = False
        test_5_passed = False
        sqli_passed   = False
        bola_passed   = False

        for test_case in security_test_cases:
            tc_name = test_case.name.lower()

            if tc_name == "sql injection":
                result = sqlinjection.sql_injection(endpoint, test_case.payload)
                if result:
                    sqli_passed = True
            elif tc_name == "bola":
                result = bola.bola(endpoint, test_case.payload)
                if result:
                    bola_passed = True

            # You can repeat similarly for test_3, test_4, test_5 if needed
            # elif tc_name == "test_3":
            #     ...
            # etc.

        # 5) After checking all tests for this endpoint, create ONE row in SecurityResult
        security_result = models.SecurityResult(
            endpoint=endpoint,
            test_3=test_3_passed,
            test_4=test_4_passed,
            test_5=test_5_passed,
            sqli=sqli_passed,
            bola=bola_passed,
            assessment_id=db_assessment.assessment_id  # link to the single assessment
        )
        db.add(security_result)
        db.commit()
        db.refresh(security_result)

        # 6) Prepare a summary for the response
        test_results.append({
            "endpoint": endpoint,
            "test_3": test_3_passed,
            "test_4": test_4_passed,
            "test_5": test_5_passed,
            "sqli": sqli_passed,
            "bola": bola_passed,
        })

    return {
        "collection_id": collection_id,
        "assessment_id": db_assessment.assessment_id,
        "timestamp": db_assessment.timestamp,
        "results": test_results
    }


#
# Crawler Demo
#
@app.post("/crawl")
async def crawl(domain_request: schemas.DomainRequest, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)):
    try:
        result = await run_crawler(domain_request.domain)
        api_endpoints = result.get("api_endpoints", [])

        # Create and store a new collection
        collection_data = schemas.CollectionCreate(
            name=domain_request.name,
            api_endpoints=api_endpoints
        )
        new_collection = crud.create_collection(db=db, collection=collection_data)

        return {"name": new_collection.name, "api_endpoints": api_endpoints}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid domain: {str(e)}")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

#
# SecurityResult Routes
#
@app.post("/results/", response_model=schemas.SecurityResult)
def create_result(
    result: schemas.SecurityResultCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Create a new row in the 'security_result' table.
    Body example:
    {
      "endpoint": "/api/v1",
      "test_3": false,
      "test_4": false,
      "test_5": false,
      "sqli": true,
      "bola": true
    }
    """
    return crud.create_security_result(db, result)

# @app.get("/results/", response_model=List[schemas.SecurityResult])
# def read_results(db: Session = Depends(get_db)):
#     """
#     Retrieve all rows in the 'security_result' table.
#     """
#     return crud.get_security_results(db)

# # 2) For retrieving a *single* security result by ID
# @app.get("/results/{security_test_case_id}", response_model=schemas.SecurityResult)
# def read_result_by_id(security_test_case_id: int, db: Session = Depends(get_db)):
#     """
#     Retrieve a single row by test_case_id.
#     """
#     return crud.get_security_result_by_id(db, security_test_case_id=security_test_case_id)

@app.get("/results/{assessment_id}", response_model=schemas.SecurityResultsByAssessment)
def get_results_by_assessment_id(
    assessment_id: int,
    db: Session = Depends(get_db)
):
    db_assessment = db.query(models.Assessment).filter(models.Assessment.assessment_id == assessment_id).first()
    if not db_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    security_results = db.query(models.SecurityResult).filter(
        models.SecurityResult.assessment_id == assessment_id
    ).all()

    return schemas.SecurityResultsByAssessment(
        assessment_id=assessment_id,
        timestamp=db_assessment.timestamp,
        results=security_results
    )


