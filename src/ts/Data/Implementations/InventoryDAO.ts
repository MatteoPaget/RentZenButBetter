import { IInventoryDAO } from "../Interfaces/IInventoryDAO.js";
import Inventory from "../../model/Inventory.js";
import { DAO } from "../DAO.js";

export default class InventoryDAO extends DAO implements IInventoryDAO {

    async addInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean> {
        const url = `/Inventory/AddInventory?idProperty=${propertyId}&token=${token}`;

        const bodyData = {
            id: inventory.id,
            Name: inventory.name,
            Description: inventory.description,
            Date: inventory.date
        };

        const result = await this.request(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        });

        return result !== null;
    }

    // 👇 Récupération d'un état des lieux existant
    async getInventoryById(id: string, token: string): Promise<Inventory | null> {
        const data = await this.request(`/Inventory/GetById?id=${id}&token=${token}`, { method: "GET" });

        if (!data) return null;

        // Mapping sécurisé (Majuscule/Minuscule + ??)
        return new Inventory(
            data.id ?? data.Id,
            data.name ?? data.Name,
            data.description ?? data.Description,
            data.date ?? data.Date
        );
    }

    // 👇 Mise à jour (Uniquement la description selon l'API)
    async updateInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean> {
        const params = new URLSearchParams({
            description: inventory.description,
            idProperty: propertyId,
            idInventory: inventory.id.toString(),
            token: token
        });

        // On envoie tout dans l'URL (PUT)
        const result = await this.request(`/Inventory/UpdateInventory?${params.toString()}`, {
            method: "PUT"
        });

        return result !== null;
    }
}