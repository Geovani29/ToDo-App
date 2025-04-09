// tests/userLogin.test.js
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

describe("Login de usuario", () => {
    it("debería iniciar sesión exitosamente con credenciales válidas", async () => {
        const credentials = {
            email: "pablito@gmail.com",
            password: "123456"
        };

        const response = await axios.post(`${API_URL}/auth/login`, credentials);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty("token");
        expect(typeof response.data.token).toBe("string");
    });

    it("debería fallar con contraseña incorrecta", async () => {
        const wrongCredentials = {
            email: "pablito@gmail.com",
            password: "wrong-password"
        };

        try {
            await axios.post(`${API_URL}/auth/login`, wrongCredentials);
        } catch (error) {
            expect(error.response.status).toBe(401); // o el código que tu backend use para login fallido
            expect(error.response.data).toHaveProperty("message");
        }
    });
});
