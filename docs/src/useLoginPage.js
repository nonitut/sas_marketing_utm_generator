import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterService from './services/register.service.js';
import LoginService from './services/login.service.js';

export function useLoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    if (!email || !password) {
      alert("Заполните все поля");
      return false;
    }
    return true;
  };

  const handleError = (error, action) => {
    if (error.response) {
      alert(`Ошибка при ${action}: ` + (error.response.data?.message || JSON.stringify(error.response.data)));
    } else if (error.request) {
      alert("Сервер не отвечает. Проверьте, что backend запущен.");
    } else {
      alert("Ошибка: " + error.message);
    }
  };

  const handleLogin = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      const res = await LoginService.login({ email, password });
      alert(res.data.message);
      onLogin(email);
      navigate("/utm");
    } catch (error) {
      handleError(error, "входе");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await RegisterService.register({ email, password });
      onLogin(email);
      navigate("/utm");
    } catch (error) {
      handleError(error, "регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    if (!email) return alert("Введите email для восстановления пароля");
    alert(`Ссылка для восстановления отправлена на ${email}`);
  };

  const handleGoogleLogin = () => {
    alert("Вход через Google (будет подключение OAuth)");
  };

  return { email, setEmail, password, setPassword, loading, handleLogin, handleRegister, handleForgot, handleGoogleLogin };
}