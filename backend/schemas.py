from typing import Optional, List
from pydantic import BaseModel

#
# Authentication Schemas
#
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

#
# User Schemas
#
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    hashed_password: str
    disabled: Optional[bool] = None

    class Config:
        from_attributes = True

#
# SecurityTestCase Schemas
#
class SecurityTestCaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    payload: Optional[str] = None

class SecurityTestCase(SecurityTestCaseBase):
    id: int

    class Config:
        from_attributes = True

#
# Collection Schemas
#
class CollectionBase(BaseModel):
    name: str
    api_endpoints: Optional[List[str]] = None

class CollectionCreate(CollectionBase):
    pass

class Collection(CollectionBase):
    collection_id: int

    class Config:
        from_attributes = True

#
# SecurityResult Schemas
#
class SecurityResultBase(BaseModel):
    endpoint: str
    test_3: bool = False
    test_4: bool = False
    test_5: bool = False
    sqli: bool = False
    bola: bool = False
    assessment_id: int


class SecurityResultCreate(SecurityResultBase):
    pass

class SecurityResult(SecurityResultBase):
    result_id: int  # This maps to 'result_id' in the DB, but we'll keep 'id' for Pydantic

    class Config:
        from_attributes = True

class SecurityResultsByAssessment(BaseModel):
    assessment_id: int
    timestamp: Optional[str] = None
    results: List[SecurityResult]

    class Config:
        from_attributes = True

#
# Assessment Schemas
#
class AssessmentBase(BaseModel):
    timestamp: Optional[str] = None
    collection_id: int

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(AssessmentBase):
    assessment_id: int

    class Config:
        from_attributes = True

#
# Domain Request (Crawler)
#
class DomainRequest(BaseModel):
    domain: str
    name: str
