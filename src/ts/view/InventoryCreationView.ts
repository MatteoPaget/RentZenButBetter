import { View } from "./View.js";
import InventoryDAO from "../Data/Implementations/InventoryDAO.js";
import Inventory from "../model/Inventory.js";
import PropertyDAO from "../Data/Implementations/PropertyDAO.js";

export class InventoryCreationView extends View {
    private dao: InventoryDAO;
    private propertyDao: PropertyDAO;
    private form: HTMLFormElement | null;
    private messageBox: HTMLElement | null;

    private currentInventoryId: number | null = null;

    constructor() {
        super(false);
        this.dao = new InventoryDAO();
        this.propertyDao = new PropertyDAO();
        this.form = document.getElementById("form-creation-etat") as HTMLFormElement;
        this.messageBox = document.getElementById("message-container");

        this.init();
    }

    public async init(): Promise<void> {
        if (this.form) {
            this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        }

        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");

        if (idParam) {
            this.currentInventoryId = parseInt(idParam);
            await this.loadInventoryData(idParam);
        }
    }

    private async loadInventoryData(id: string): Promise<void> {
        const token = sessionStorage.getItem("userToken") || "";
        const inventory = await this.dao.getInventoryById(id, token);

        if (inventory) {
            (document.getElementById("nom") as HTMLInputElement).value = inventory.name;
            (document.getElementById("description") as HTMLTextAreaElement).value = inventory.description;

            if (inventory.date) {
                const dateStr = inventory.date.split('T')[0];
                (document.getElementById("date") as HTMLInputElement).value = dateStr;
            }

            const title = document.querySelector("h1");
            const btn = document.querySelector("button[type='submit']");
            if (title) title.textContent = "Modifier l'État des Lieux";
            if (btn) btn.textContent = "Mettre à jour";

            (document.getElementById("nom") as HTMLInputElement).disabled = true;
            (document.getElementById("date") as HTMLInputElement).disabled = true;
        } else {
            this.afficherMessage("Erreur : Impossible de charger les données.", "red");
        }
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const nom = (document.getElementById("nom") as HTMLInputElement).value.trim();
        const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
        const date = (document.getElementById("date") as HTMLInputElement).value;

        if (!nom || !date) {
            this.afficherMessage("Veuillez remplir le nom et la date.", "red");
            return;
        }

        const token = sessionStorage.getItem("userToken") || "";
        const propertyId = sessionStorage.getItem("selectedPropertyId");

        if (!propertyId) {
            this.afficherMessage("Erreur : Aucun bien sélectionné.", "red");
            return;
        }

        const idToSend = this.currentInventoryId !== null ? this.currentInventoryId : 0;
        const inventory = new Inventory(idToSend, nom, description, date);

        let success: boolean;

        if (this.currentInventoryId !== null) {
            // Mode UPDATE
            success = await this.dao.updateInventory(inventory, propertyId, token);
        } else {
            // Mode CRÉATION
            success = await this.dao.addInventory(inventory, propertyId, token);

            if (success) {
                console.log("Création réussie, mise à jour du statut de la propriété...");
                await this.propertyDao.setInventoryState(propertyId, 1, token);
            }
        }

        if (success) {
            this.afficherMessage("Enregistré avec succès !", "green");
            //setTimeout(() => window.location.href = "PropertyList.html", 350);
        } else {
            this.afficherMessage("Erreur lors de l'enregistrement.", "red");
        }
    }

    private afficherMessage(msg: string, color: string): void {
        if (this.messageBox) {
            this.messageBox.textContent = msg;
            this.messageBox.style.color = color;
            this.messageBox.style.display = "block";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new InventoryCreationView();
});