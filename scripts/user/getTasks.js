const axios = require("axios");
const { user } = require("../config"); // ajusta la ruta según dónde estés
// URL base de la API
const API_URL = "http://localhost:5000/api";

// Funci�n para iniciar sesi�n
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data.token;
  } catch (error) {
    console.error("Error al iniciar sesi�n:");
    console.error(error.response ? error.response.data : error.message);
    return null;
  }
}

// Funci�n para obtener tareas
async function getTasks(token) {
  try {
    const response = await axios.get(
      `${API_URL}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Tareas obtenidas exitosamente:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error al obtener tareas:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar las funciones
async function run() {
  // Cambia esto por tu email y contrase�a
  const email = user.email;
  const password = user.password;
  
  console.log("Iniciando sesi�n...");
  const token = await login(email, password);
  
  if (token) {
    console.log("\nObteniendo tareas...");
    await getTasks(token);
  }
}

run();
