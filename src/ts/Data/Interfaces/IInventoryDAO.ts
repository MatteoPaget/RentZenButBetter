import Inventory from "../../model/Inventory";

export interface IInventoryDAO {
    // Ajoute un etat des lieux
    addInventory(inventory: Inventory, propertyId: string, token: string): Promise<boolean>;
}