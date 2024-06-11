from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
"""
The functions in this file are used to interact with the database.
"""

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        email=user.email,
        full_name=user.full_name, 
        hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_security_test_case(db: Session, security_test_case_id: int):
    return db.query(models.SecurityTestCase).filter(models.SecurityTestCase.id == security_test_case_id).first()

def create_security_test_case(db: Session, security_test_case: schemas.SecurityTestCaseBase):
    db_security_test_case = models.SecurityTestCase(
        name=security_test_case.name,
        description=security_test_case.description,
        payload=security_test_case.payload
    )
    db.add(db_security_test_case)
    db.commit()
    db.refresh(db_security_test_case)
    return db_security_test_case

def get_security_test_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SecurityTestCase).offset(skip).limit(limit).all()

def get_security_test_cases_by_name(db: Session, name: str):
    return db.query(models.SecurityTestCase).filter(models.SecurityTestCase.name == name).first()
