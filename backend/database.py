from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base
from pathlib import Path

# формируем путь к файлу БД рядом с этим файлом (надёжнее, чем относительный путь от cwd)
DB_PATH = Path(__file__).resolve().parent / "UTM_user_manager.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)



# engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
