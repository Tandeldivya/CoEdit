import axios from "axios";
import config from "../config";

axios.defaults.withCredentials = true;

// Create an instance of Axios for API requests
const API = axios.create({
  baseURL: config.BACKEND_API,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to dynamically add token, username, and image headers
API.interceptors.request.use((config) => {
  // Get the token, username, and image from localStorage (or any other source like Context or Redux)
  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const userImage = localStorage.getItem("image");

  if (token) config.headers["Auth-Token"] = token;  // Add the token to the headers
  if (username) config.headers["X-Username"] = username;  // Custom header for username
  if (userImage) config.headers["X-Image"] = userImage;    // Custom header for image

  // Return the updated config
  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function executeCode(language = "javascript", version = "18.15.0", sourceCode = "", input = "") {

  const data = {
    language: language,
    version: version,
    files: [
      {
        content: sourceCode,
      },
    ],
    stdin: input,
  }

  const headers = {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", data, headers);
    return response.data.run;
  } catch (error) {
    throw new Error("Cannot Run !");
  }
}

export default API;
