# файл для работы с безопасностью (хеширование паролей)
# хеширование это процесс преобразования пароля в зашифрованный формат
# pip install passlib
# pip install bcrypt
# pwd_context - контекст для хеширования паролей
# deprecated="auto" - устаревшие алгоритмы будут автоматически обновлены
# соль - случайная строка, добавляемая к паролю перед хешированием для защиты от атак по словарю

from passlib.context import CryptContext

class SecurityService:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def hash_password(cls, password: str) -> str:
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        return cls.pwd_context.verify(plain_password, hashed_password)
    
# нужно переносить в env файл - файлы 

