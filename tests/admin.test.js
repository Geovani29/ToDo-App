const axios = require("axios");

const API_URL = "http://localhost:5000/api";

describe("Registro y login del administrador", () => {
    const adminData = {
        name: "Admin Test",
        email: `admin${Date.now()}@ejemplo.com`, // único
        password: "123456",
        role: "admin"
    };

    it("debería registrar un nuevo administrador exitosamente", async () => {
        const res = await axios.post(`${API_URL}/auth/register`, adminData);

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("success", true);
        expect(res.data).toHaveProperty("token");
    });

    it("debería iniciar sesión como administrador exitosamente", async () => {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: adminData.email,
            password: adminData.password
        });

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("token");
        expect(typeof res.data.token).toBe("string");
    });
});
