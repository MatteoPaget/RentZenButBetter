import { DAO } from "../DAO.js";
import { IPropertyDAO } from "../Interfaces/IPropertyDAO.js";
import Property from "../../model/Property.js";

export default class PropertyDAO extends DAO implements IPropertyDAO {

    async getPropertiesByOwner(token: string): Promise<Property[]> {
        const data = await this.request(`/Property/GetProperties?token=${token}`, { method: "GET" });

        if (!data || !Array.isArray(data)) return [];
        return data.map((item: any) => new Property(item.id, item.name, item.address, item.rent));
    }

    async getAllProperties(token: string): Promise<Property[]> {
        const data = await this.request(`/Property/GetAllProperties?token=${token}`, { method: "GET" });

        if (!data || !Array.isArray(data)) return [];

        return data.map((item: any) => new Property(item.id, item.name, item.address, item.rent));
    }

    async getPropertyById(id: string, token: string): Promise<Property | null> {
        const data = await this.request(`/Property/GetProperty?id=${id}&token=${token}`, { method: "GET" });

        if (!data) return null;
        return new Property(data.id, data.name, data.address, data.rent);
    }

    async updateProperty(property: Property, token: string): Promise<boolean> {
        const result = await this.request(`/Property/UpdateProperty?token=${token}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: property.id,
                Name: property.name,
                Address: property.address,
                Rent: property.rent
            })
        });
        return result !== null;
    }
}