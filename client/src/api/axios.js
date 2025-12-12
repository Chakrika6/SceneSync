/*import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

export default instance;
*/
// client/src/api/axios.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "/";
export default axios.create({
  baseURL: BASE,
  withCredentials: false, // change to true only if you use cookies and configured CORS credentials
});
