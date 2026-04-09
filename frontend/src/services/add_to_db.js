import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/add_utm';


class add_to_db {
  add_to_db(userData) {
    return axios.post(API_URL, {
    user_id: userData.user_id,
    source: userData.source,
    medium: userData.medium,
    campaign: userData.campaign,
    term: userData.term,
    content: userData.content,
    resulting_url: userData.resulting_url,
    created_at: userData.created_at
    });
  }
}

export default new add_to_db();