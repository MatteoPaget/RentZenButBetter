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
}