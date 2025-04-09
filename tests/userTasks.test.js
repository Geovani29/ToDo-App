const axios = require("axios");

const API_URL = "http://localhost:5000/api";
const credentials = {
    email: "pablito@gmail.com",
    password: "123456"
};

let token = null;

beforeAll(async () => {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    token = res.data.token;
});

describe("Gestión de tareas - Usuario", () => {
    it("debería crear una tarea exitosamente", async () => {
        const taskData = {
            title: "Tarea de prueba",
            description: "Avisame cuando sea hora de ir a dormir",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
        };

        const res = await axios.post(`${API_URL}/tasks`, taskData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("data");
        expect(res.data.data).toHaveProperty("title", taskData.title);
    });

    it("debería obtener la lista de tareas del usuario", async () => {
        const res = await axios.get(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("data");
        expect(Array.isArray(res.data.data)).toBe(true);

        if (res.data.data.length > 0) {
            expect(res.data.data[0]).toHaveProperty("title");
            expect(res.data.data[0]).toHaveProperty("description");
        }
    });
});
