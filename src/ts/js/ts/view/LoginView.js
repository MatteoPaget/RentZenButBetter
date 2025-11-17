import UserDAO from "../Data/Implementations/UserDAO.js";
export class LoginView {
    dao;
    authForm;
    authMsg;
    constructor() {
        this.dao = new UserDAO();
        this.authForm = document.getElementById("authForm");
        this.authMsg = document.getElementById("message");
        this.init();
    }
    init() {
        console.log("Auth/Connexion View Initialized");
        if (this.authForm) {
            this.authForm.addEventListener("submit", (e) => this.handleAuthSubmit(e));
        }
    }
    async handleAuthSubmit(event) {
        event.preventDefault();
        const mailInput = document.getElementById("mail");
        const passInput = document.getElementById("pass");
        const mail = mailInput.value.trim();
        const pass = passInput.value.trim();
        if (!mail || !pass) {
            this.afficherMessage("Merci de remplir l'email et le mot de passe.", "red");
            return;
        }
        // Appel au DAO (C'est ici que la magie opère proprement !)
        const token = await this.dao.login(mail, pass);
        if (token) {
            this.processSuccess(token);
        }
        else {
            this.afficherMessage("Email ou mot de passe incorrect (ou erreur API).", "red");
        }
    }
    processSuccess(token) {
        sessionStorage.setItem("userToken", token);
        const tokenData = this.parseJwt(token);
        // Récupération sécurisée du rôle (gestion des clés bizarres de Microsoft)
        const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const userRole = tokenData ? tokenData[roleKey] : null;
        if (!userRole) {
            this.afficherMessage("Erreur : Impossible de lire le rôle.", "red");
            return;
        }
        this.afficherMessage("Connexion réussie ! Redirection...", "green");
        this.redirectUser(userRole);
    }
    redirectUser(role) {
        switch (role) {
            case "bailleur":
                window.location.href = '../../bail/liste/liste.html';
                break;
            case "agent":
                window.location.href = '../../agent/liste/liste.html';
                break;
            case "admin":
                window.location.href = '../../admin/admin.html';
                break;
            default:
                this.afficherMessage(`Rôle "${role}" non reconnu.`, "red");
        }
    }
    afficherMessage(msg, couleur) {
        if (this.authMsg) {
            this.authMsg.innerHTML = msg;
            this.authMsg.style.color = couleur;
        }
    }
    // Utilitaire interne pour décoder le token
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }
        catch (e) {
            console.error("Erreur parsing JWT", e);
            return null;
        }
    }
}
// Démarrage de la page
document.addEventListener("DOMContentLoaded", () => {
    new LoginView();
});
