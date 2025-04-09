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

// Funci�n para obtener todas las tareas de todos los usuarios (solo admin)
async function getAllTasks(token) {
  try {
    const response = await axios.get(
      `${API_URL}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Lista de todas las tareas de todos los usuarios (como admin):");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error al obtener tareas:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar las funciones
async function run() {
  console.log("Iniciando sesi�n como administrador...");
  const token = await loginAsAdmin();
  
  if (token) {
    console.log("\nObteniendo todas las tareas como administrador...");
    await getAllTasks(token);
  }
}

run();
