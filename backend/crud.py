from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# def get_security_test_case(db: Session, security_test_case_id: int):
#     return db.query(models.SecurityTestCase).filter(models.SecurityTestCase.name == security_test_case_id).first()

def create_security_test_case(db: Session, security_test_case: schemas.SecurityTestCaseCreate):
    db_security_test_case = models.SecurityTestCase(name=security_test_case.name, description=security_test_case.description)
    db.add(db_security_test_case)
    db.commit()
    db.refresh(db_security_test_case)
    return db_security_test_case

def get_security_test_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SecurityTestCase).offset(skip).limit(limit).all()

def get_security_test_cases_by_name(db: Session, name: str):
    return db.query(models.SecurityTestCase).filter(models.SecurityTestCase.name == name).first()
