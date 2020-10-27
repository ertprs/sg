import axios from 'axios';

const userUrl = String(window.location.href).slice(0, 14);

var baseURL = '';
if (userUrl === 'http://192.168')
  baseURL = 'http://192.168.1.1:3333'
else if (userUrl === 'http://localho')
  baseURL = 'http://177.36.223.44:3333';
else
  baseURL = 'http://177.36.223.44:3333';

console.log(userUrl, baseURL);

const api = axios.create({
  baseURL: baseURL,
})

export default api;