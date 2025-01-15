from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#
# Password / Auth Helpers
#
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

#
# User CRUD
#
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
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

#
# SecurityTestCase CRUD
#
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

#
# Collection CRUD
#
def create_collection(db: Session, collection: schemas.CollectionBase):
    db_collection = models.Collection(
        name=collection.name,
        api_endpoints=collection.api_endpoints
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

def get_collections(db: Session):
    return db.query(models.Collection).all()

def get_collection_by_id(db: Session, collection_id: int):
    return db.query(models.Collection).filter(models.Collection.collection_id == collection_id).first()

def delete_collection(db: Session, collection_id: int):
    db_collection = get_collection_by_id(db, collection_id)
    if db_collection:
        db.delete(db_collection)
        db.commit()
    return db_collection

#
# SecurityResult CRUD
#
def create_security_result(db: Session, sr: schemas.SecurityResultCreate) -> models.SecurityResult:
    """
    Inserts a new row into the 'security_result' table,
    akin to: endpoint | test_3 | test_4 | test_5 | sqli | bola
    """
    db_sr = models.SecurityResult(
        endpoint=sr.endpoint,
        test_3=sr.test_3,
        test_4=sr.test_4,
        test_5=sr.test_5,
        sqli=sr.sqli,
        bola=sr.bola
    )
    db.add(db_sr)
    db.commit()
    db.refresh(db_sr)
    return db_sr

def get_security_results(db: Session):
    return db.query(models.SecurityResult).all()

def get_security_result_by_id(db: Session, security_test_case_id: int):
    return db.query(models.SecurityResult).filter(
        models.SecurityResult.security_test_case_id == security_test_case_id
    ).first()

#
# Assessment CRUD
#
def create_assessment(db: Session, collection_id: int, result_id: int):
    db_assessment = models.Assessment(
        collection_id=collection_id,
        result_id=result_id
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment
