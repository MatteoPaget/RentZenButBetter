import { DAO } from "../DAO.js";
import { IPropertyDAO } from "../Interfaces/IPropertyDAO.js";
import Property from "../../model/Property.js";

export default class PropertyDAO extends DAO implements IPropertyDAO {

    async getPropertiesByOwner(token: string): Promise<Property[]> {
        // Attention : Utilisez bien "GetMyProperties" ici
        const data = await this.request(`/Property/GetMyProperties?token=${token}`, { method: "GET" });

        console.log("Données reçues (Mes Biens) :", data);

        // Si data contient une clé "property" on prend son contenu
        const rawList = (data && data.property) ? data.property : data;

        // verif tableau
        if (!rawList || !Array.isArray(rawList)) return [];

        return rawList.map((item: any) => new Property(
            item.id ?? item.Id,
            item.name ?? item.Name,
            item.address ?? item.Address ?? item.Adress ?? item.adress,
            item.rent ?? item.Rent,
            item.type ?? item.Type,
            item.inventory ?? item.Inventory
        ));
    }

    async getAllProperties(token: string): Promise<Property[]> {
        const data = await this.request(`/Property/GetAllProperties?token=${token}`, {method: "GET"});

        console.log("Données reçues (Tout) :", data);

        if (!data || !Array.isArray(data)) return [];

        return data.map((item: any) => new Property(
            item.id ?? item.Id,
            item.name ?? item.Name,
            item.address ?? item.Address ?? item.Adress ?? item.adress,
            item.rent ?? item.Rent,
            item.inventory ?? item.Inventory
        ));
    }

    async getPropertyById(id: string, token: string): Promise<Property | null> {
        const data = await this.request(`/Property/GetById?id=${id}&token=${token}`, { method: "GET" });

        const item = (data && data.property) ? data.property : data;

        if (!item) return null;

        return new Property(
            item.id ?? item.Id,
            item.name ?? item.Name,
            item.address ?? item.Address ?? item.Adress ?? item.adress,
            item.rent ?? item.Rent,
            item.type ?? item.Type
        );
    }

    async updateProperty(property: Property, token: string): Promise<boolean> {

        const params = new URLSearchParams({
            id: property.id.toString(),
            name: property.name,
            rent: property.rent.toString(),
            inventoryState: "0", // A degager dans le futur
            token: token
        });

        const result = await this.request(`/Property/UpdateProperty?${params.toString()}`, {
            method: "PUT"
        });

        return result !== null;
    }

    async addProperty(property: Property, token: string): Promise<boolean> {
        const bodyData = {
            name: property.name,
            adress: property.address,
            rent: property.rent,
            type: property.type
        };

        const result = await this.request(`/Property/AddProperty?token=${token}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyData)
        });

        return result !== null;
    }
    async setInventoryState(propertyId: string, state: number, token: string): Promise<boolean> {
        const params = new URLSearchParams({
            idProperty: propertyId,
            state: state.toString(),
            token: token
        });

        const result = await this.request(`/Property/SetInventoryState?${params.toString()}`, {
            method: "PUT"
        });

        return result !== null;
    }

}