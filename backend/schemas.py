from typing import Optional, List
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

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

class SecurityTestCaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    payload: Optional[str] = None

class SecurityTestCase(SecurityTestCaseBase):
    id: int

    class Config:
        from_attributes = True

class DomainRequest(BaseModel):
    domain: str


class CollectionBase(BaseModel):
    name: str
    api_endpoints: Optional[List[str]] = None

class CollectionCreate(CollectionBase):
    pass

class Collection(CollectionBase):
    collection_id: int

    class Config:
        from_attributes = True

class SecurityResultBase(BaseModel):
    sqli: bool
    bola: bool
    test_3: bool
    test_4: bool
    test_5: bool

class SecurityResultCreate(SecurityResultBase):
    pass

class SecurityResult(SecurityResultBase):
    result_id: int

    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    timestamp: str
    collection_id: int
    result_id: int

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(AssessmentBase):
    assessment_id: int

    class Config:
        from_attributes = True
