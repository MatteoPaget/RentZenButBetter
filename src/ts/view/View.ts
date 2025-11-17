import { Page } from "./Page.js";

export abstract class View implements Page {

    // Vérifie la sécurité dès qu'on crée la page
    constructor(isPublic: boolean = false) {
        if (!isPublic) {
            this.checkSecurity();
        }
    }

    // Implémentation par défaut de init
    abstract init(): void;


     //Vérifie si l'utilisateur est connecté, Sinon, le renvoie vers la page de login.
    protected checkSecurity(): void {
        const token = sessionStorage.getItem("userToken");

        if (!token) {
            console.warn("Accès refusé : Utilisateur non connecté.");
            window.location.href = "Login.html";
        }
    }
}