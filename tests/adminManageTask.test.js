const axios = require("axios");

const API_URL = "http://localhost:5000/api";

let adminToken = null;
let taskId = null;

beforeAll(async () => {
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
        email: "admin@ejemplo.com",
        password: "123456"
    });
    adminToken = adminLogin.data.token;

    const email = `task-${Date.now()}@mail.com`;

    await axios.post(`${API_URL}/auth/register`, {
        name: "User para tarea",
        email,
        password: "123456"
    });

    const loginUser = await axios.post(`${API_URL}/auth/login`, {
        email,
        password: "123456"
    });

    const taskRes = await axios.post(
        `${API_URL}/tasks`,
        {
            title: "Tarea admin",
            description: "Tarea a gestionar",
            dueDate: new Date().toISOString().split("T")[0]
        },
        {
            headers: { Authorization: `Bearer ${loginUser.data.token}` }
        }
    );

    taskId = taskRes.data.data._id;
});

describe("Administrador - Gestionar tarea", () => {
    it("debería actualizar el estado de una tarea", async () => {
        const res = await axios.put(
            `${API_URL}/tasks/${taskId}`,
            { status: "completada" },
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        expect(res.status).toBe(200);
        expect(res.data.data.status).toBe("completada");
    });
});
