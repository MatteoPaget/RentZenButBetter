import { View } from "./View.js";
import PropertyDAO from "../Data/Implementations/PropertyDAO.js";

export class PropertyDetailsView extends View {
    private dao: PropertyDAO;
    private propertyId: string | null = null;

    constructor() {
        super(false); // Page privée
        this.dao = new PropertyDAO();
        this.init();
    }

    public async init(): Promise<void> {
        // 1. Récupération de l'ID dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        this.propertyId = urlParams.get("id");

        if (this.propertyId) {
            await this.loadDetails(this.propertyId);
        } else {
            console.error("Aucun ID fourni !");
            // Optionnel : retour liste
            // window.location.href = "PropertyList.html";
        }
    }

    private async loadDetails(id: string): Promise<void> {
        const token = sessionStorage.getItem("userToken") || "";

        // Appel au DAO (Attention : vérifie que ton getPropertyById est bien corrigé avec "GetById")
        const property = await this.dao.getPropertyById(id, token);

        if (property) {
            // 2. Remplissage des champs (affichage texte)
            this.setText("detail-name", property.name);
            this.setText("detail-address", property.address);
            this.setText("detail-rent", property.rent + " €");
            this.setText("detail-type", property.type);

            // Ici, on pourra ajouter plus tard le chargement des locataires ou des états des lieux
        } else {
            const container = document.querySelector(".container");
            if(container) container.innerHTML = "<p class='error'>Impossible de charger les informations du bien.</p>";
        }
    }

    // Petite fonction utilitaire pour éviter les répétitions
    private setText(elementId: string, text: string): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PropertyDetailsView();
});