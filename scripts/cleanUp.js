const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../src/models/User");
const Task = require("../src/models/Task");

async function cleanDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Elimina usuarios de prueba basados en su email
        const deletedUsers = await User.deleteMany({
            email: {
                $regex: /^(delete-|update-|task-|admin-actions-).+@mail\.com$/
            }
        });

        // También puedes borrar a "pablito@gmail.com" si fue creado por test
        await User.deleteOne({ email: "pablito@gmail.com" });

        // Elimina todas las tareas
        const deletedTasks = await Task.deleteMany({});

        console.log(`🧹 Usuarios eliminados: ${deletedUsers.deletedCount + 1}`);
        console.log(`🧹 Tareas eliminadas: ${deletedTasks.deletedCount}`);

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error al limpiar la base de datos:", error.message);
        mongoose.connection.close();
    }
}

cleanDatabase();
