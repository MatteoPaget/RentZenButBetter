import Inventory from "../../model/Inventory";

export interface IInventoryDAO {
    addInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean>;
    // On ajoutera updateStatus ici plus tard si besoin
}