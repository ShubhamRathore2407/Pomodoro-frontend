import axios from './axiosConfig';

const generateAndSetNewTokens = async () => {
  const reResponse = await axios.post('/auth/refreshToken');
  localStorage.removeItem('access_token');
  localStorage.setItem('access_token', reResponse.data.accessToken);
};

export default generateAndSetNewTokens;
