import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

class LoginService {
  login(userData) {
    return axios.post(`${API_URL}/login`, {
      email: userData.email,
      password: userData.password,
    });
  }

  register(userData) {
    return axios.post(`${API_URL}/registration`, {
      email: userData.email,
      password: userData.password,
    });
  }
}

export default new LoginService();
