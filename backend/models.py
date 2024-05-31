from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

"""
This file defines the database models.
"""

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    disabled = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)


class SecurityTestCase(Base):
    __tablename__ = "security_test_cases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    payload = Column(String, nullable=True)
