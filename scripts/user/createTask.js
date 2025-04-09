const axios = require("axios");
const { user } = require("../config"); // ajusta la ruta según dónde estés

// URL base de la API
const API_URL = "http://localhost:5000/api";

// Datos para crear una tarea
const taskData = {
  title: "Tarea de prueba",
  description: "AVisame cuando sea hora de ir a dormir y que me des una buena cena",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 7 d�as desde hoy
};

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

// Funci�n para crear una tarea
async function createTask(token) {
  try {
    const response = await axios.post(
      `${API_URL}/tasks`, 
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Tarea creada exitosamente:");
    console.log(response.data);
  } catch (error) {
    console.error("Error al crear tarea:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar las funciones
async function run() {
  // Usa el email y contrase�a de tu usuario
  const email = user.email;
  const password = user.password;
  
  console.log("Iniciando sesi�n...");
  const token = await login(email, password);
  
  if (token) {
    console.log("\nCreando tarea...");
    await createTask(token);
  }
}

run();
