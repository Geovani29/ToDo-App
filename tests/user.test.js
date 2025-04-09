// tests/user.test.js
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

describe("Registro de usuario", () => {
    it("debería registrar un nuevo usuario exitosamente", async () => {
        const userData = {
            name: "Pablito",
            email: "pablito" + Date.now() + "@gmail.com", // correo único
            password: "123456"
        };

        const response = await axios.post(`${API_URL}/auth/register`, userData);

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty("success", true);
        expect(response.data).toHaveProperty("token");
        expect(typeof response.data.token).toBe("string");
    });

    it("debería fallar si el usuario ya existe", async () => {
        const existingUser = {
            name: "Pablito",
            email: "pablito@gmail.com",
            password: "123456"
        };

        try {
            await axios.post(`${API_URL}/auth/register`, existingUser);
        } catch (error) {
            expect(error.response.status).toBe(400); // o el código que retorne tu backend
            expect(error.response.data).toHaveProperty("message");
        }
    });
});
