const axios = require("axios");
const { user } = require("../config"); // asegúrate de tener config.js con las credenciales

const API_URL = "http://localhost:5000/api";

// Iniciar sesión como usuario
async function login() {
    const res = await axios.post(`${API_URL}/auth/login`, {
        email: user.email,
        password: user.password
    });
    return res.data.token;
}

// Obtener todas las tareas del usuario
async function getTasks(token) {
    const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
}

// Eliminar una tarea por ID
async function deleteTask(token, taskId) {
    const res = await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

async function run() {
    try {
        const token = await login();
        const tasks = await getTasks(token);

        if (tasks.length === 0) {
            console.log("⚠️ No hay tareas para eliminar.");
            return;
        }

        const taskToDelete = tasks[0];
        const result = await deleteTask(token, taskToDelete._id);
        console.log("✅ Tarea eliminada:", result);
    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
    }
}

run();
