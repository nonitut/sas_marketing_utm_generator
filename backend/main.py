from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# pip install "fastapi[standard]"
from sqlalchemy.orm import Session
# pip install SQLAlchemy
from typing import List
import os
from backend.schemas import UserCreate , UserLogin , UTMData , ShortenedURL
from backend.database import SessionLocal, init_db
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from backend.services.db_service import DataBaseService
from backend.services.securety import SecurityService
import secrets
from backend.services.short_url import shorten_url



# Credentials - данные для аутентификации


app=FastAPI(
    title="Generator UTM user meneger API",
    description="something",
    version="0.0.1"
)

security = HTTPBasic()
data_base_service = DataBaseService(SessionLocal())


init_db()   

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Depends - зависимость, позволяет внедрять зависимости в маршруты
# credentials это данные для аутентификации (логин и пароль)
# compare_digest - безопасное сравнение строк, защищает от атак по времени

def auth_user(credentials: HTTPBasicCredentials = Depends(security)):
    user = data_base_service.get_user_by_email(credentials.username)
    if user is None :
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    if secrets.compare_digest(
        credentials.password, 
        user.hashed_password
    ):
        return user

# база - endpoint (конечная точка)
# стартовая страница = итоговой точкой
@app.get("/")
def root():
    return {
        "message" : "Generator UTM user meneger API"
    }

#  uvicorn backend.main:app 
#  uvicorn main:app --reload


origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  raise это исключение

@app.post("/registration")
def registration(user: UserCreate, db: Session = Depends(get_db) ):
    data_base_service = DataBaseService(db)
    if data_base_service.user_exists(user.email):
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")
    
    hashed_password = SecurityService.hash_password(user.password) 
    data_base_service.create_user(email=user.email, hashed_password=hashed_password)
    return {
        "message": f"Регистрация для {user.email}"
    }


# выдача токена - JWT (JSON Web Token)


# если нет почти такого пользователя, то выдаем ошибку 400
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db) ):
    data_base_service = DataBaseService(db)
    if not data_base_service.user_exists(user.email):
        raise HTTPException(status_code=400, detail="Пользователь с таким email не существует")
    
    db_user = data_base_service.get_user_by_email(email=user.email)
    if not SecurityService.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    user_utm = data_base_service.get_utm_data_by_user_id(db_user.id)

    return {
        "message": f"Поздравляю {user.email}. Вы успешно вошли в систему!",
        "user": {"id": db_user.id, "email": db_user.email},
        "utm_data": user_utm
    }


# Создаем запись в таблице с данными / данные в словаре - это UTMData, который мы описали в schemas.py
# **utm_data.model_dump() - распаковка словаря, который мы получили от клиента, и передаем его в функцию create_utm_parameter, которая создает запись в таблице utm_parameters
# unzipping

@app.post("/add_utm")
def add_utm(utm_data: UTMData, db: Session = Depends(get_db) ):
    data_base_service = DataBaseService(db)
    if not data_base_service.create_utm_data(utm_data):
        raise HTTPException(status_code=400, detail="Ошибка при добавлении UTM данных")
    return {
        "message": f"UTM данные для пользователя {utm_data.user_id} успешно добавлены!"
    }

    # проверки и return


@app.get("/get_utm/{user_id}", response_model=List[UTMData])
def get_utm(user_id: int, db: Session = Depends(get_db) ):
    data_base_service = DataBaseService(db)
    utm_data_list = data_base_service.get_utm_data_by_user_id(user_id)
    if not utm_data_list:
        raise HTTPException(status_code=404, detail="UTM данные для данного пользователя не найдены")
    return utm_data_list


@app.post("/short_new_url") 
def short_new_url(url: ShortenedURL):
    original_url = url.original_url
    short_url = shorten_url(original_url)
    if not short_url:
        raise HTTPException(status_code=400, detail="Ошибка при сокращении URL")
    return {
        "short_url": short_url
    }
