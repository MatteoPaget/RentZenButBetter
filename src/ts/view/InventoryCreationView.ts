import { View } from "./View.js";
import InventoryDAO from "../Data/Implementations/InventoryDAO.js";
import Inventory from "../model/Inventory.js";

export class InventoryCreationView extends View {
    private dao: InventoryDAO;
    private form: HTMLFormElement | null;
    private messageBox: HTMLElement | null;

    constructor() {
        super(false);

        this.dao = new InventoryDAO();
        this.form = document.getElementById("form-creation-etat") as HTMLFormElement;
        this.messageBox = document.getElementById("message-container");

        this.init();
    }

    public init(): void {
        if (this.form) {
            this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        }
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();

        // Récupération des données
        const nom = (document.getElementById("nom") as HTMLInputElement).value.trim();
        const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
        const date = (document.getElementById("date") as HTMLInputElement).value;

        // Récupération des infos de session
        const token = sessionStorage.getItem("userToken") || "";
        const propertyId = sessionStorage.getItem("selectedPropertyId");

        if (!propertyId) {
            this.afficherMessage("Erreur : Aucun bien sélectionné. Veuillez passer par la liste des biens.", "red");
            return;
        }

        // Création de l'objet et envoi
        const newInventory = new Inventory(0, nom, description, date);
        const success = await this.dao.addInventory(newInventory, propertyId, token);

        if (success) {
            this.afficherMessage("État des lieux créé avec succès !", "green");
            this.form?.reset();
        } else {
            this.afficherMessage("Une erreur est survenue lors de la création.", "red");
        }
    }

    private afficherMessage(msg: string, color: string): void {
        if (this.messageBox) {
            this.messageBox.textContent = msg;
            this.messageBox.style.color = color;
        }
    }
}

// Lancement automatique
document.addEventListener("DOMContentLoaded", () => {
    new InventoryCreationView();
});