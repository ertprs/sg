import axios from 'axios';

//const baseURL = 'https://sgcog.herokuapp.com';
const baseURL = 'http://192.168.1.1:3333';
//const baseURL = 'http://177.36.223.44:3333';

const api = axios.create({
  baseURL: baseURL,
})

export default api;