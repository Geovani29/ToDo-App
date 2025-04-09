const axios = require("axios");

const API_URL = "http://localhost:5000/api";

let adminToken = null;
let userId = null;

beforeAll(async () => {
    const loginAdmin = await axios.post(`${API_URL}/auth/login`, {
        email: "admin@ejemplo.com",
        password: "123456"
    });
    adminToken = loginAdmin.data.token;

    const email = `update-${Date.now()}@mail.com`;

    await axios.post(`${API_URL}/auth/register`, {
        name: "Usuario para actualizar",
        email,
        password: "123456"
    });

    const loginUser = await axios.post(`${API_URL}/auth/login`, {
        email,
        password: "123456"
    });

    const decoded = JSON.parse(
        Buffer.from(loginUser.data.token.split(".")[1], "base64").toString()
    );
    userId = decoded.id;
});

describe("Administrador - Actualizar un usuario", () => {
    it("debería actualizar el nombre del usuario", async () => {
        const res = await axios.put(
            `${API_URL}/users/${userId}`,
            { name: "Nombre actualizado" },
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        expect(res.status).toBe(200);
        expect(res.data.data.name).toBe("Nombre actualizado");
    });
});
