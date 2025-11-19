import { View } from "./View.js";
import PropertyDAO from "../Data/Implementations/PropertyDAO.js";
import Property from "../model/Property.js";

export class PropertyFormView extends View {
    private dao: PropertyDAO;
    private form: HTMLFormElement | null;
    private messageBox: HTMLElement | null;
    private currentPropertyId: number | null = null; // modif ou non

    constructor() {
        super(false); // page privée
        this.dao = new PropertyDAO();
        this.form = document.getElementById("property-form") as HTMLFormElement;
        this.messageBox = document.getElementById("message-box");
        this.init();
    }

    public async init(): Promise<void> {
        if (this.form) {
            this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        }

        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");

        if (idParam) {
            this.currentPropertyId = parseInt(idParam);
            console.log("Mode Modification pour ID :", this.currentPropertyId);
            await this.loadPropertyData(idParam);
        } else {
            console.log("Mode Creation");
        }
    }


    // Charge les données du bien et remplit le formulaire
    private async loadPropertyData(id: string): Promise<void> {
        const token = sessionStorage.getItem("userToken") || "";
        const property = await this.dao.getPropertyById(id, token);

        if (property) {
            (document.getElementById("name") as HTMLInputElement).value = property.name;
            (document.getElementById("address") as HTMLInputElement).value = property.address;
            (document.getElementById("rent") as HTMLInputElement).value = property.rent.toString();

            const typeSelect = document.getElementById("type") as HTMLSelectElement;
            typeSelect.value = property.type;

            // changement titre
            const title = document.querySelector("h1");
            const btn = document.querySelector("button[type='submit']");

            if (title) title.textContent = "Modifier la Propriété";
            if (btn) btn.textContent = "Sauvegarder les modifications";

        } else {
            this.afficherMessage("Erreur : Impossible de charger le bien.", "red");
        }
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();

        // Récupération des champs (Comme avant)
        const name = (document.getElementById("name") as HTMLInputElement).value;
        const address = (document.getElementById("address") as HTMLInputElement).value;
        const rent = parseFloat((document.getElementById("rent") as HTMLInputElement).value);
        const type = (document.getElementById("type") as HTMLSelectElement).value;

        if (!name || !address || isNaN(rent)) {
            this.afficherMessage("Veuillez remplir tous les champs.", "red");
            return;
        }

        const token = sessionStorage.getItem("userToken") || "";

        // ID actuel si modif, 0 si création
        const idToSend = this.currentPropertyId !== null ? this.currentPropertyId : 0;
        const propertyToSend = new Property(idToSend, name, address, rent, type);

        let success: boolean;

        if (this.currentPropertyId !== null) {
            // Mode UPDATE
            success = await this.dao.updateProperty(propertyToSend, token);
        } else {
            // Mode CREATE
            success = await this.dao.addProperty(propertyToSend, token);
        }

        if (success) {
            const action = this.currentPropertyId !== null ? "modifiée" : "ajoutée";
            this.afficherMessage(`Propriété ${action} avec succès !`, "green");
            setTimeout(() => window.location.href = "PropertyList.html", 250);
        } else {
            this.afficherMessage("Une erreur est survenue.", "red");
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
    new PropertyFormView();
});