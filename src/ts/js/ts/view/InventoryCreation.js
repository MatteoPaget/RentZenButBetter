import Inventory from "../model/Inventory";
import InventoryDAO from "../Data/Implementations/InventoryDAO";
// On instancie le DAO
const inventoryDAO = new InventoryDAO();
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-creation-etat");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nom = document.getElementById("nom").value.trim();
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;
        // Création de l'objet PROPRE via le modèle
        const newInventory = new Inventory(0, nom, description, date);
        const token = sessionStorage.getItem("userToken") || "";
        const propertyId = sessionStorage.getItem("selectedPropertyId") || "";
        // Appel PROPRE via le DAO
        const success = await inventoryDAO.addInventory(newInventory, propertyId, token);
        if (success) {
            console.log("Succès !");
            // Gestion de l'affichage (couleur verte, reset form...)
        }
        else {
            console.error("Échec !");
            // Gestion de l'erreur
        }
    });
});
