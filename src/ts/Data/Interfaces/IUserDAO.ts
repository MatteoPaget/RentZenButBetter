import User from "../../model/User.js";

export interface IUserDAO {

    // Tente de connecter un utilisateur, return le token
    login(email: string, pass: string): Promise<string | null>;

    // verifie si l'email existe
    emailExists(email: string): Promise<boolean>;

    // Enregistre l'utilisateur dans la bdd
    register(user: User, password: string): Promise<boolean>;
}