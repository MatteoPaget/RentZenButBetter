import Inventory from "../../model/Inventory.js";

export interface IInventoryDAO {
    addInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean>;
    getInventoryById(id: string, token: string): Promise<Inventory | null>;
    updateInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean>;
}