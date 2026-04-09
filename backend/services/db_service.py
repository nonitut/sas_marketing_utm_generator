# основные действия с базой данных
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship, declarative_base
from typing import Optional
from backend.models import User , UTMParameter
from backend.schemas import UTMData
# postgresql://user:password@localhost/dbname
# orm - object relational mapping (объектно-реляционное отображение) прослойка между реляционной базой данных и объектно-ориентированным программированием
# hash - хеш-функция, одностороннее преобразование данных в строку фиксированной длины

class DataBaseService:
    def __init__(self, db_session):
        self.db = db_session

    def user_exists(self, email: str) -> bool:
        return self.db.query(User).filter(User.email == email).first() is not None
    
    def create_user(self, email: str, hashed_password: str) -> User:
        new_user = User(email=email, hashed_password=hashed_password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()
    

    def create_utm_data(self, utm_data: UTMData) -> UTMData:
        new_utm_data = UTMParameter(**utm_data.model_dump())
        # создаем новый объект UTMData, распаковывая словарь, 
        # который мы получили от клиента, и передаем его в конструктор UTMData
        self.db.add(new_utm_data)
        self.db.commit()
        self.db.refresh(new_utm_data)
        return new_utm_data
    
    def get_utm_data_by_user_id(self, user_id: int) -> list[UTMParameter]:
        return self.db.query(UTMParameter).filter(UTMParameter.user_id == user_id).all()