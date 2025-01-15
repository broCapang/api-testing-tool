from sqlalchemy import Boolean, Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func

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

class Collection(Base):
    __tablename__ = "collection"

    collection_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    api_endpoints = Column(JSON)

    # Relationship to Assessment and SecurityResult
    assessments = relationship("Assessment", back_populates="collection", cascade="all, delete-orphan")
    
# SecurityResult Model
class SecurityResult(Base):
    __tablename__ = "security_result"

    result_id = Column(Integer, primary_key=True, index=True)
    endpoint = Column(String, nullable=False)
    test_3 = Column(Boolean, default=False)
    test_4 = Column(Boolean, default=False)
    test_5 = Column(Boolean, default=False)
    sqli = Column(Boolean, default=False)
    bola = Column(Boolean, default=False)
    assessment_id = Column(Integer, ForeignKey("assessment.assessment_id"))

    # Relationship to Assessment
    assessments = relationship("Assessment", back_populates="security_result")

# Assessment Model
class Assessment(Base):
    __tablename__ = "assessment"

    assessment_id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, server_default=func.now())
    collection_id = Column(Integer, ForeignKey("collection.collection_id"))

    # Relationships
    collection = relationship("Collection", back_populates="assessments")
    security_result = relationship("SecurityResult", back_populates="assessments")

