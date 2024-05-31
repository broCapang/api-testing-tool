from typing import Optional
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
        orm_mode = True

class SecurityTestCaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    payload: Optional[str] = None

class SecurityTestCase(SecurityTestCaseBase):
    id: int

    class Config:
        orm_mode = True
