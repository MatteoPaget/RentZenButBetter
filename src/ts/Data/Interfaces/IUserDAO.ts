export interface IUserDAO {
    /**
     * Tente de connecter un utilisateur.
     * @returns Le token JWT si succès, ou null si échec.
     */
    login(email: string, pass: string): Promise<string | null>;
}