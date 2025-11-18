import { Page } from "./Page.js";

export abstract class View implements Page {

    // Vérifie la sécurité dès qu'on crée la page
    constructor(isPublic: boolean = false) {

        this.injectHeader();

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

    // Banniere
    private injectHeader(): void {
        const role = sessionStorage.getItem("userRole") || "Invité";

        document.body.insertAdjacentHTML("afterbegin", `
            <nav class="top-banner">
                <div class="user-info">
                    <strong>RentZen</strong> 
                    <span class="separator">|</span> 
                    <span>${role}</span>
                </div>
                <a href="../../index.html" class="btn-home">Accueil</a>
            </nav>
        `);
    }
}