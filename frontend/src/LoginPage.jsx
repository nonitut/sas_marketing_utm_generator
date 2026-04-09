import React, { useState } from "react";
import RegisterService from './services/register.service.js';
import LoginService from './services/login.service.js';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return alert("Заполните все поля");

    LoginService.login({ email, password })
      .then((res) => {
        alert(res.data.message);
        onLogin(res.data.user);
      })
      .catch((error) => {
        if (error.response) {
          alert("Ошибка при входе: " + (error.response.data?.detail || error.response.data?.message || JSON.stringify(error.response.data)));
        } else {
          alert("Сервер не отвечает. Проверьте, что backend запущен.");
        }
      });
  };

const handleRegister = async () => {
  if (!email || !password) {
    alert("Введите email и пароль для регистрации");
    return;
  }

  try {
    const res = await RegisterService.register({ email, password });
    alert(res.data.message || "Регистрация успешна! Теперь вы можете войти.");
    // После регистрации можно сразу залогинить и загрузить UTM (если нужно)
    const loginRes = await LoginService.login({ email, password });
    onLogin(loginRes.data.user);
  } catch (error) {
    if (error.response) {
      alert(
        "Ошибка при регистрации: " +
        (error.response.data?.message || JSON.stringify(error.response.data))
      );
    } else if (error.request) {
      alert("Сервер не отвечает. Проверьте, что backend запущен.");
    } else {
      alert("Ошибка: " + error.message);
    }
  }
};

  const handleForgot = () => {
    if (!email) return alert("Введите email для восстановления пароля");
    alert(`Ссылка для восстановления отправлена на ${email} (пока только фронт)`);
  };

  const handleGoogleLogin = () => {
    alert("Вход через Google (будет подключение OAuth)");
  };

  // ======================
  // Стили
  // ======================
  const containerStyle = {
    width: "40vw",
    marginLeft: "60%",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "0.5rem",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2196F3",
  };

  const linkStyle = {
    color: "#2196F3",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "center",
    display: "block",
    marginBottom: "1rem",
  };

  // ======================
  // JSX
  // ======================
  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2vw" }}>
        Войти / Зарегистрироваться
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleLogin} style={buttonStyle}>Войти</button>
      <button onClick={handleRegister} style={secondaryButtonStyle}>Зарегистрироваться</button>
      <span onClick={handleForgot} style={linkStyle}>Забыл пароль?</span>

      <hr style={{ margin: "1.5rem 0" }} />

      <button
        onClick={handleGoogleLogin}
        style={{ ...buttonStyle, backgroundColor: "#DB4437" }}
      >
        Войти через Google
      </button>
    </div>
  );
}

export default LoginPage;
