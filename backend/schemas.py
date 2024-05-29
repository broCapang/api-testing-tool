from pydantic import BaseModel

class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


class SecurityTestCaseBase(BaseModel):
    name: str
    description: str = None

class SecurityTestCaseCreate(SecurityTestCaseBase):
    pass

class SecurityTestCase(SecurityTestCaseBase):
    id: int

    class Config:
        orm_mode = True