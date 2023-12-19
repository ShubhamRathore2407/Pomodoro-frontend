import axios from 'axios';

const generateAndSetNewTokens = async () => {
  const reResponse = await axios.post('http://localhost:5000/api/auth/refreshToken');
  localStorage.removeItem('access_token');
  localStorage.setItem('access_token', reResponse.data.accessToken);
};

export default generateAndSetNewTokens;
