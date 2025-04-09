const axios = require("axios");
const { admin } = require("../config"); // ajusta la ruta según dónde estés

// URL base de la API
const API_URL = "http://localhost:5000/api";

// Datos para crear un administrador
const adminData = {
  name: admin.name,
  email: admin.email,
  password: admin.password,
  role: admin.role
};

// Funci�n para crear un administrador
async function createAdmin() {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, adminData);
    console.log("Administrador creado exitosamente:");
    console.log(response.data);
  } catch (error) {
    console.error("Error al crear administrador:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar la funci�n
createAdmin();
