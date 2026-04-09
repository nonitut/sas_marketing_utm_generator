import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/registration';


class RegisterService {
  register(userData) {
    return axios.post(API_URL, {
      email: userData.email,
      password: userData.password,
    });
  }
}

export default new RegisterService();
