import axios from "axios";
import { User } from "../../core/domain/User";
import { AuthService } from "../../core/ports/AuthService";

export class AuthServiceImpl implements AuthService {
    private readonly apiUrl = "http://localhost:8000"; // Ajusta si tu backend está en otra URL o puerto

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

            return user;
        } catch (error) {
            console.error("Error en login:", error);
            return null;
        }
    }

    async logout(): Promise<void> {
        console.log("Logout ejecutado");
    }
}
