const axios = require("axios");
const readline = require("readline");
const { admin } = require("../config"); // ajusta la ruta según dónde estés


// URL base de la API
const API_URL = "http://localhost:5000/api";

// Crear interfaz para leer de la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisificaci�n de la pregunta
function question(query) {
    return new Promise(resolve => {
        rl.question(query, answer => {
            resolve(answer);
        });
    });
}

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

// Funci�n para obtener todos los usuarios
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

// Funci�n para eliminar un usuario (solo admin)
async function deleteUser(token, userId) {
    try {
        const response = await axios.delete(
            `${API_URL}/users/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Usuario eliminado exitosamente.");
    } catch (error) {
        console.error("Error al eliminar usuario:");
        console.error(error.response ? error.response.data : error.message);
    }
}

// Ejecutar las funciones
async function run() {
    console.log("Iniciando sesi�n como administrador...");
    const token = await loginAsAdmin();

    if (token) {
        // Obtener la lista de usuarios
        const users = await getAllUsers(token);
        if (users.length === 0) {
            console.log("No se encontraron usuarios para eliminar");
            rl.close();
            return;
        }

        // Mostrar la lista de usuarios
        console.log("\nLista de usuarios disponibles:");
        users.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user._id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}`);
        });

        // Preguntar si realmente quiere eliminar a un usuario
        const confirmDelete = await question("\n�Quieres eliminar alg�n usuario? (s/n): ");

        if (confirmDelete.toLowerCase() === "s") {
            const userIndex = await question("Ingresa el n�mero del usuario a eliminar: ");
            const index = parseInt(userIndex) - 1;

            if (index >= 0 && index < users.length) {
                const userToDelete = users[index];
                console.log(`\nEliminando usuario con ID: ${userToDelete._id}...`);
                await deleteUser(token, userToDelete._id);
            } else {
                console.log("�ndice inv�lido. Operaci�n cancelada.");
            }
        } else {
            console.log("Operaci�n cancelada.");
        }
    }

    rl.close();
}

run();
