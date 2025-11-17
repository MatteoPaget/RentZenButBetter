"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Idéalement, cette URL doit être dans un fichier de config commun, pas ici.
const API_URL = "https://10.128.207.44:8081";
class InventoryDAO {
    addInventory(inventory, propertyId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${API_URL}/Inventory/AddInventory?idProperty=${propertyId}&token=${token}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: inventory.id, // Probablement 0 lors de la création
                        Name: inventory.name,
                        Description: inventory.description,
                        Date: inventory.date
                    })
                });
                if (!response.ok)
                    throw new Error("Erreur API");
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
exports.default = InventoryDAO;
