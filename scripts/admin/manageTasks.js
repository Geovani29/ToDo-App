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

// Funci�n para obtener todas las tareas
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
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener tareas:");
    console.error(error.response ? error.response.data : error.message);
    return [];
  }
}

// Funci�n para actualizar una tarea (admin puede actualizar cualquier tarea)
async function updateTask(token, taskId, updateData) {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Tarea actualizada exitosamente:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error al actualizar tarea:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Funci�n para eliminar una tarea (admin puede eliminar cualquier tarea)
async function deleteTask(token, taskId) {
  try {
    const response = await axios.delete(
      `${API_URL}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Tarea eliminada exitosamente.");
  } catch (error) {
    console.error("Error al eliminar tarea:");
    console.error(error.response ? error.response.data : error.message);
  }
}

// Ejecutar las funciones
async function run() {
  console.log("Iniciando sesi�n como administrador...");
  const token = await loginAsAdmin();
  
  if (token) {
    // Obtener todas las tareas (siendo admin, obtiene todas las tareas de todos los usuarios)
    const tasks = await getAllTasks(token);
    if (tasks.length === 0) {
      console.log("No se encontraron tareas");
      rl.close();
      return;
    }
    
    // Mostrar la lista de tareas
    console.log("\nLista de tareas disponibles:");
    tasks.forEach((task, index) => {
      console.log(`${index+1}. ID: ${task._id}, T�tulo: ${task.title}, Estado: ${task.status}, Propietario: ${task.owner}`);
    });
    
    // Opciones de administraci�n
    console.log("\nOpciones de administraci�n (privilegios de admin):");
    console.log("1. Actualizar estado de una tarea");
    console.log("2. Eliminar una tarea");
    console.log("3. Salir");
    
    const option = await question("\nSelecciona una opci�n (1-3): ");
    
    switch(option) {
      case "1":
        // Actualizar una tarea
        const updateIndex = await question("Ingresa el n�mero de la tarea a actualizar: ");
        const indexToUpdate = parseInt(updateIndex) - 1;
        
        if (indexToUpdate >= 0 && indexToUpdate < tasks.length) {
          const taskToUpdate = tasks[indexToUpdate];
          
          console.log("\nSelecciona el nuevo estado:");
          console.log("1. pendiente");
          console.log("2. en progreso");
          console.log("3. completada");
          
          const statusOption = await question("Opci�n (1-3): ");
          let newStatus;
          
          switch(statusOption) {
            case "1": newStatus = "pendiente"; break;
            case "2": newStatus = "en progreso"; break;
            case "3": newStatus = "completada"; break;
            default: 
              console.log("Opci�n inv�lida. Operaci�n cancelada.");
              rl.close();
              return;
          }
          
          console.log(`\nActualizando tarea con ID: ${taskToUpdate._id}...`);
          await updateTask(token, taskToUpdate._id, { status: newStatus });
        } else {
          console.log("�ndice inv�lido. Operaci�n cancelada.");
        }
        break;
        
      case "2":
        // Eliminar una tarea
        const deleteIndex = await question("Ingresa el n�mero de la tarea a eliminar: ");
        const indexToDelete = parseInt(deleteIndex) - 1;
        
        if (indexToDelete >= 0 && indexToDelete < tasks.length) {
          const taskToDelete = tasks[indexToDelete];
          console.log(`\nEliminando tarea con ID: ${taskToDelete._id}...`);
          await deleteTask(token, taskToDelete._id);
        } else {
          console.log("�ndice inv�lido. Operaci�n cancelada.");
        }
        break;
        
      case "3":
        console.log("Saliendo...");
        break;
        
      default:
        console.log("Opci�n inv�lida.");
    }
  }
  
  rl.close();
}

run();
