const axios = require("axios");
const { admin } = require("../config"); // ajusta la ruta según dónde estés

// URL base de la API
const API_URL = "http://localhost:5000/api";

// Función para iniciar sesión como administrador
async function loginAsAdmin() {
    try {
        const adminData = {
            email: admin.email,
            password: admin.password
        };

        const response = await axios.post(`${API_URL}/auth/login`, adminData);
        console.log("Inicio de sesión exitoso (administrador):");
        console.log(response.data);
        return response.data.token;
    } catch (error) {
        console.error("Error al iniciar sesión como administrador:");
        console.error(error.response ? error.response.data : error.message);
        return null;
    }
}

// Función para obtener todos los usuarios
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
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener usuarios:");
        console.error(error.response ? error.response.data : error.message);
        return [];
    }
}

// Función para actualizar un usuario (solo admin)
async function updateUser(token, userId, updateData) {
    try {
        const response = await axios.put(
            `${API_URL}/users/${userId}`,
            updateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Usuario actualizado exitosamente:");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error al actualizar usuario:");
        console.error(error.response ? error.response.data : error.message);
    }
}

// Ejecutar las funciones
async function run() {
    console.log("Iniciando sesión como administrador...");
    const token = await loginAsAdmin();

    if (token) {
        // Obtener la lista de usuarios
        const users = await getAllUsers(token);
        if (users.length === 0) {
            console.log("No se encontraron usuarios para actualizar");
            return;
        }

        // Buscar un usuario no-admin para actualizar
        const userToUpdate = users.find(u => u.role !== "admin");
        if (!userToUpdate) {
            console.log("No se encontró un usuario no-admin para actualizar");
            return;
        }

        console.log(`\nActualizando usuario con ID: ${userToUpdate._id}...`);

        // Datos para actualizar (cambiar el nombre)
        const updateData = {
            name: `${userToUpdate.name} (Actualizado por Admin)`
        };

        await updateUser(token, userToUpdate._id, updateData);
    }
}

run();