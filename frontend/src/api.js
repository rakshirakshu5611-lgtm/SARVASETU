
import axios from "axios";

const API_BASE_URL = "http://172.20.40.101:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export default API;
