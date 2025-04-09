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
    console.log("Inicio de sesi�n exitoso (administrador):");
    console.log(response.data);
    return response.data.token;
  } catch (error) {
    console.error("Error al iniciar sesi�n como administrador:");
    console.error(error.response ? error.response.data : error.message);
    return null;
  }
}

// Funci�n para obtener todos los usuarios (solo admin)
async function getAllUsers(token) {
  try {
    const response = await axios.get(
      `${API_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Lista de todos los usuarios (solo visible para admin):");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error al obtener usuarios:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar las funciones
async function run() {
  console.log("Iniciando sesi�n como administrador...");
  const token = await loginAsAdmin();
  
  if (token) {
    console.log("\nObteniendo lista de todos los usuarios...");
    await getAllUsers(token);
  }
}

run();
