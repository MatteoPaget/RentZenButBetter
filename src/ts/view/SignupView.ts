import UserDAO from "../Data/Implementations/UserDAO.js";
import User from "../model/User.js";
import { View } from "./View.js";

export class SignupView extends View {
    private dao: UserDAO;
    private form: HTMLFormElement | null;
    private messageBox: HTMLElement | null;

    constructor() {
        super(true);
        this.dao = new UserDAO();
        this.form = document.getElementById("registerForm") as HTMLFormElement;
        this.messageBox = document.getElementById("message");
        this.init();
    }

    public init(): void {
        if (this.form) {
            this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        // Récupération des champs
        const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
        const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
        const email = (document.getElementById("mail") as HTMLInputElement).value.trim();
        const pass = (document.getElementById("mdp") as HTMLInputElement).value.trim();
        const passConfirm = (document.getElementById("mdpConfirm") as HTMLInputElement).value.trim();
        const role = (document.getElementById("role") as HTMLSelectElement).value;

        if (!firstName || !lastName || !email || !pass || !passConfirm) {
            this.afficherMessage("Veuillez remplir tous les champs.", "red");
            return;
        }
        if (pass.length < 8) {
            this.afficherMessage("Le mot de passe doit faire au moins 8 caractères.", "red");
            return;
        }
        if (pass !== passConfirm) {
            this.afficherMessage("Les mots de passe ne correspondent pas.", "red");
            return;
        }

        // Vérification email
        const exists = await this.dao.emailExists(email);
        if (exists) {
            this.afficherMessage("Cet email est déjà utilisé.", "red");
            return;
        }

        // Création
        const newUser = new User(firstName, lastName, email, role);
        const success = await this.dao.register(newUser, pass);

        if (success) {
            this.afficherMessage("Compte créé avec succès ! Redirection...", "green");
            this.form?.reset();
            setTimeout(() => window.location.href = "Login.html", 2000);
        } else {
            this.afficherMessage("Erreur lors de la création du compte.", "red");
        }
    }

    private afficherMessage(msg: string, color: string): void {
        if (this.messageBox) {
            this.messageBox.textContent = msg;
            this.messageBox.style.color = color;
        }
    }
}

// Lancement
document.addEventListener("DOMContentLoaded", () => {
    new SignupView();
});