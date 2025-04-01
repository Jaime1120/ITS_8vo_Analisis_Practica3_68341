import axios from "axios";
import { User } from "../../core/domain/User";
import { AuthService } from "../../core/ports/AuthService";

export class AuthServiceImpl implements AuthService {
  private readonly apiUrl = "http://localhost:8000";

  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, { email, password });

      const { id, name, email: userEmail, access_token } = response.data;

      const user: User = {
        id: id.toString(),
        name,
        email: userEmail,
        token: access_token,
      };

      // Guardar usuario completo en localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      return user;
    } catch (error) {
      console.error("Error en login:", error);
      return null;
    }
  }

  async register(name: string, email: string, password: string): Promise<User | null> {
    try {
      await axios.post(`${this.apiUrl}/register`, { name, email, password });

      // Login automático después de registro
      return await this.login(email, password);
    } catch (error) {
      console.error("Error en registro:", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    console.log("Logout exitoso");
  }
}
