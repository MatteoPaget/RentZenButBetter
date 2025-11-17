import { IInventoryDAO } from "../Interfaces/IInventoryDAO";
import Inventory from "../../model/Inventory";

// Idéalement, cette URL doit être dans un fichier de config commun, pas ici.
const API_URL = "https://10.128.207.44:8081";

export default class InventoryDAO implements IInventoryDAO {

    async addInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/Inventory/AddInventory?idProperty=${propertyId}&token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: inventory.id, // Probablement 0 lors de la création
                    Name: inventory.name,
                    Description: inventory.description,
                    Date: inventory.date
                })
            });

            if (!response.ok) throw new Error("Erreur API");
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}