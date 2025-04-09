const axios = require("axios");
const { admin } = require("../config"); // ajusta la ruta según dónde estés

// URL base de la API
const API_URL = "http://localhost:5000/api";

// Funci�n para iniciar sesi�n como administrador
async function loginAsAdmin() {
  try {
    const adminData = {
      email: admin.email,
      password: admin.password
    };
    
    const response = await axios.post(`${API_URL}/auth/login`, adminData);
    console.log("Inicio de sesi�n exitoso como administrador:");
    console.log(response.data);
    return response.data.token;
  } catch (error) {
    console.error("Error al iniciar sesi�n como administrador:");
    console.error(error.response ? error.response.data : error.message);
    return null;
  }
}

loginAsAdmin();
