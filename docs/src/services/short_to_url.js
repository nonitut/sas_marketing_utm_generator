import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/short_new_url';


class ShortenUrlService {
  shortenUrl(url) {
    return axios.post(API_URL, {
      original_url: url
    });
  }
}


export default new ShortenUrlService();
