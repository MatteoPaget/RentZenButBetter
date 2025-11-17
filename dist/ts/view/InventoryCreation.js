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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = __importDefault(require("../model/Inventory"));
const InventoryDAO_1 = __importDefault(require("../Data/Implementations/InventoryDAO"));
// On instancie le DAO
const inventoryDAO = new InventoryDAO_1.default();
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-creation-etat");
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const nom = document.getElementById("nom").value.trim();
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;
        // Création de l'objet PROPRE via le modèle
        const newInventory = new Inventory_1.default(0, nom, description, date);
        const token = sessionStorage.getItem("userToken") || "";
        const propertyId = sessionStorage.getItem("selectedPropertyId") || "";
        // Appel PROPRE via le DAO
        const success = yield inventoryDAO.addInventory(newInventory, propertyId, token);
        if (success) {
            console.log("Succès !");
            // Gestion de l'affichage (couleur verte, reset form...)
        }
        else {
            console.error("Échec !");
            // Gestion de l'erreur
        }
    }));
});
