import { View } from "./View.js";
import PropertyDAO from "../Data/Implementations/PropertyDAO.js";
import Property from "../model/Property.js";

export class PropertyListView extends View {
    private dao: PropertyDAO;
    private tableBody: HTMLElement | null;
    private selectedRow: HTMLElement | null = null;

    // Boutons d'action
    private btnCreate: HTMLButtonElement | null;
    private btnEdit: HTMLButtonElement | null;
    private btnValidate: HTMLButtonElement | null;

    constructor() {
        super(false); // Page privée (sécurisée)
        this.dao = new PropertyDAO();

        this.tableBody = document.getElementById("propertyListBody");
        this.btnCreate = document.getElementById("btnCreerAgeLis") as HTMLButtonElement;
        this.btnEdit = document.getElementById("btnModifierAgeLis") as HTMLButtonElement;
        this.btnValidate = document.getElementById("btnValider") as HTMLButtonElement;

        this.init();
    }

    public async init(): Promise<void> {
        this.btnCreate?.addEventListener("click", () => this.navigate("InventoryCreation.html"));
        this.btnEdit?.addEventListener("click", () => console.log("Vers page modification...")); // À faire plus tard
        this.btnValidate?.addEventListener("click", () => console.log("Vers page validation...")); // À faire plus tard

        const token = sessionStorage.getItem("userToken") || "";
        const role = sessionStorage.getItem("userRole") || ""; // On récupère le rôle

        let properties: Property[] = [];

        // LOGIQUE DE CHOIX
        if (role === "agent" || role === "admin") {
            console.log("Mode Agent");
            properties = await this.dao.getAllProperties(token);
        } else {
            console.log("Mode Bailleur");
            properties = await this.dao.getPropertiesByOwner(token);
        }

        this.renderTable(properties);
    }

    private renderTable(properties: Property[]): void {
        if (!this.tableBody) return;
        this.tableBody.innerHTML = ""; // On vide le tableau

        if (properties.length === 0) {
            this.tableBody.innerHTML = "<tr><td colspan='3'>Aucun bien trouvé.</td></tr>";
            return;
        }

        properties.forEach(prop => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer"; // Montre que c'est cliquable

            tr.innerHTML = `
                <td>${prop.name}</td>
                <td>${prop.address}</td>
                <td>${prop.rent} €</td>
            `;

            tr.addEventListener("click", () => this.selectRow(tr, prop.id));

            this.tableBody?.appendChild(tr);
        });
    }

    private selectRow(row: HTMLElement, id: number): void {
        if (this.selectedRow) {
            this.selectedRow.style.backgroundColor = ""; // On désélectionne l'ancienne
            this.selectedRow.style.color = "";
        }
        this.selectedRow = row;
        this.selectedRow.style.backgroundColor = "#3498db"; // Bleu
        this.selectedRow.style.color = "white";

        sessionStorage.setItem("selectedPropertyId", id.toString());

        if (this.btnCreate) this.btnCreate.disabled = false;
        if (this.btnEdit) this.btnEdit.disabled = false;
        if (this.btnValidate) this.btnValidate.disabled = false;
    }

    private navigate(page: string): void {
        window.location.href = page;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PropertyListView();
});