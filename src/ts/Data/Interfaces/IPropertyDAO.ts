import Property from "../../model/Property.js";

export interface IPropertyDAO {
    getPropertiesByOwner(token: string): Promise<Property[]>;
    getPropertyById(id: string, token: string): Promise<Property | null>;
    updateProperty(property: Property, token: string): Promise<boolean>;
    getAllProperties(token: string): Promise<Property[]>;
    addProperty(property: Property, token: string): Promise<boolean>;
    setInventoryState(propertyId: string, state: number, token: string): Promise<boolean>;
}