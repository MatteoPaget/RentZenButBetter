"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginView = void 0;
const UserDAO_js_1 = __importDefault(require("../Data/Implementations/UserDAO.js"));
class LoginView {
    constructor() {
        this.dao = new UserDAO_js_1.default();
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
    handleAuthSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const token = yield this.dao.login(mail, pass);
            if (token) {
                this.processSuccess(token);
            }
            else {
                this.afficherMessage("Email ou mot de passe incorrect (ou erreur API).", "red");
            }
        });
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
exports.LoginView = LoginView;
// Démarrage de la page
document.addEventListener("DOMContentLoaded", () => {
    new LoginView();
});
