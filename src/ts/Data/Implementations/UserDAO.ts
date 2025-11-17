import { IUserDAO } from "../Interfaces/IUserDAO.js";
import User from "../../model/User.js";
import { DAO } from "../DAO.js";

export default class UserDAO extends DAO implements IUserDAO {

    async login(email: string, pass: string): Promise<string | null> {
        const url = `/User/Login?email=${encodeURIComponent(email)}&passwd=${encodeURIComponent(pass)}`;

        const data = await this.request(url, { method: "GET" });

        if (data) {
            return data.token || null;
        }
        return null;
    }

    async emailExists(email: string): Promise<boolean> {
        const url = `/User/EmailExists?email=${encodeURIComponent(email)}`;
        const data = await this.request(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        return !!data;
    }

    async register(user: User, password: string): Promise<boolean> {
        const body = {
            Email: user.email,
            Password: password,
            FirstName: user.firstName,
            LastName: user.lastName,
            Role: user.role
        };

        const data = await this.request("/User/CreateUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        return data !== null;
    }
}