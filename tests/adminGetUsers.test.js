const axios = require("axios");

const API_URL = "http://localhost:5000/api";

let adminToken = null;

beforeAll(async () => {
    const res = await axios.post(`${API_URL}/auth/login`, {
        email: "admin@ejemplo.com",
        password: "123456"
    });
    adminToken = res.data.token;
});

describe("Administrador - Obtener todos los usuarios", () => {
    it("debería devolver un array de usuarios", async () => {
        const res = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.data.data)).toBe(true);
    });
});
