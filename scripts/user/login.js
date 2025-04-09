const axios = require("axios");
const { user } = require("../config"); // ajusta la ruta según dónde estés

// URL base de la API
const API_URL = "http://localhost:5000/api";

// Funci�n para iniciar sesi�n como usuario normal
async function loginAsUser() {
  try {
    const userData = {
      email: user.email,
      password: user.password
    };
    
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    console.log("Inicio de sesi�n exitoso:");
    console.log(response.data);
    return response.data.token;
  } catch (error) {
    console.error("Error al iniciar sesi�n:");
    console.error(error.response ? error.response.data : error.message);
    return null;
  }
}

loginAsUser();
