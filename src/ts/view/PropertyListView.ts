import { View } from "./View.js";
import PropertyDAO from "../Data/Implementations/PropertyDAO.js";
import Property from "../model/Property.js";

export class PropertyListView extends View {
    private dao: PropertyDAO;
    private tableBody: HTMLElement | null;
    private selectedRow: HTMLElement | null = null;

    // Boutons Agent
    private btnCreate: HTMLButtonElement | null;
    private btnEdit: HTMLButtonElement | null;
    private btnValidate: HTMLButtonElement | null;

    // Boutons Bailleur
    private btnAddProp: HTMLButtonElement | null;
    private btnModProp: HTMLButtonElement | null;
    private btnDelProp: HTMLButtonElement | null;
    private btnCheckProp: HTMLButtonElement | null;

    constructor() {
        super(false); // Page privée
        this.dao = new PropertyDAO();

        this.tableBody = document.getElementById("propertyListBody");

        // Récupération Agent
        this.btnCreate = document.getElementById("btnCreerAgent") as HTMLButtonElement;
        this.btnEdit = document.getElementById("btnModifierAgent") as HTMLButtonElement;
        this.btnValidate = document.getElementById("btnValiderAgent") as HTMLButtonElement;

        // Récupération Bailleur
        this.btnAddProp = document.getElementById("btnAddPropertyBailleur") as HTMLButtonElement;
        this.btnModProp = document.getElementById("btnModPropertyBailleur") as HTMLButtonElement;
        this.btnDelProp = document.getElementById("btnDelPropertyBailleur") as HTMLButtonElement;
        this.btnCheckProp = document.getElementById("btnCheckPropertyBailleur") as HTMLButtonElement;

        this.init();
    }

    public async init(): Promise<void> {
        // agent
        this.btnCreate?.addEventListener("click", () => this.navigate("InventoryCreation.html"));
        this.btnEdit?.addEventListener("click", () => console.log("Agent: Modifier EDL..."));
        this.btnValidate?.addEventListener("click", () => console.log("Agent: Valider EDL..."));

        // bailleur
        this.btnAddProp?.addEventListener("click", () => console.log("Bailleur: Ajouter propriété..."));
        this.btnModProp?.addEventListener("click", () => console.log("Bailleur: Modifier propriété..."));
        this.btnDelProp?.addEventListener("click", () => console.log("Bailleur: Supprimer propriété..."));
        this.btnCheckProp?.addEventListener("click", () => console.log("Bailleur: Consulter propriété..."));

        const token = sessionStorage.getItem("userToken") || "";
        const role = sessionStorage.getItem("userRole") || "";

        // adapte l'interface visuelle
        this.updateUI(role);

        let properties: Property[] = [];

        if (role === "agent" || role === "gestionnaire" || role === "admin") {
            console.log("Mode Agent : Chargement global");
            properties = await this.dao.getAllProperties(token);
        } else {
            console.log("Mode Bailleur : Chargement personnel");
            properties = await this.dao.getPropertiesByOwner(token);
        }

        this.renderTable(properties);
    }

    // change les textes et affiche les boutons selon le rôle.
    private updateUI(role: string): void {
        const mainTitle = document.querySelector("h1");
        const subTitle = document.querySelector("h2");

        const actionsBarAgent = document.querySelector(".actions-barAgent") as HTMLElement;
        const actionsBarBailleur = document.querySelector(".actions-barBailleur") as HTMLElement;

        // cahcé par defaut
        if (actionsBarAgent) actionsBarAgent.style.display = "none";
        if (actionsBarBailleur) actionsBarBailleur.style.display = "none";

        // VISUEL BAILLEUR
        if (role === "bailleur") {
            if (mainTitle) mainTitle.textContent = "Mon Tableau de Bord";
            if (subTitle) subTitle.textContent = "Mes locations";
            if (actionsBarBailleur) actionsBarBailleur.style.display = "block";
        } else {
            // VISUEL AGENT / ADMIN
            if (mainTitle) mainTitle.textContent = "Gestion des États des Lieux";
            if (subTitle) subTitle.textContent = "Tous les biens immobiliers";
            if (actionsBarAgent) actionsBarAgent.style.display = "block";
        }
    }

    private renderTable(properties: Property[]): void {
        if (!this.tableBody) return;
        this.tableBody.innerHTML = "";

        if (properties.length === 0) {
            this.tableBody.innerHTML = "<tr><td colspan='3'>Aucun bien trouvé.</td></tr>";
            return;
        }

        properties.forEach(prop => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";

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
            this.selectedRow.style.backgroundColor = "";
            this.selectedRow.style.color = "";
        }
        this.selectedRow = row;
        this.selectedRow.style.backgroundColor = "#3498db";
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