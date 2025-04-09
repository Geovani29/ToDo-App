const axios = require("axios");
const { user } = require("../config"); // ajusta la ruta según dónde estés

// URL base de la API
const API_URL = "http://localhost:5000/api";

// Datos para crear un usuario normal
const userData = {
  name: user.name,
  email: user.email,
  password: user.password
};

// Funci�n para crear un usuario
async function createUser() {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log("Usuario creado exitosamente:");
    console.log(response.data);
  } catch (error) {
    console.error("Error al crear usuario:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar la funci�n
createUser();
