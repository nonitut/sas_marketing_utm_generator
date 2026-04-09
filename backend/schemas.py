# модули данных / валидация данных
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel): 
    email:str
    password:str = Field (..., min_length=2, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=2, max_length=50)


class UTMData(BaseModel):
    user_id: int
    source:  str
    medium:  str
    campaign:  str
    term: str
    content: str
    resulting_url: str
    created_at: Optional[datetime] = None
    
    # №	URL страницы	utm_source	utm_medium	utm_content	utm_term	utm_campaign	Итоговая ссылка	Дата	Удалить
    # id: Optional[int] = Field(primary_key=True, )  # user_id - внешний ключ, связывающий UTM-параметры с пользователем / номер utm параметра
    
    # sqlalchemy.orm.exc.UnmappedInstanceError: Class 'backend.schemas.UTMData' is not mapped
    

class ShortenedURL(BaseModel):
    original_url: str
