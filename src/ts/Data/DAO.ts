export abstract class DAO {
    protected readonly API_URL = "https://10.128.207.44:8081";


     //Méthode générique pour faire des appels API. Elle gère automatiquement les erreurs réseaux et les codes HTTP les plus commun

    protected async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        try {
            const response = await fetch(`${this.API_URL}${endpoint}`, options);

            // check html
            if (!response.ok) {
                this.handleHttpError(response.status);
                return null;
            }

            // check json
            const text = await response.text();
            return text ? JSON.parse(text) : true;

        } catch (error) {
            console.error("ERREUR:", error);
            return null;
        }
    }

    // Centralisation des codes d'erreur
    private handleHttpError(status: number): void {
        switch (status) {
            case 400:
                console.error("(400) Mauvaise requete.");
                break;
            case 401:
                console.warn("(401) Session expirée ou invalide.");
                window.location.href = "../view/Login.html";
                break;
            case 403:
                console.error("(403) Vous n'avez pas les droits.");
                break;
            case 404:
                console.error("(404) Ressource introuvable.");
                break;
            case 500:
                console.error("(500) Erreur serveur.");
                break;
            default:
                console.error(` Erreur : (${status})`);
        }
    }
}