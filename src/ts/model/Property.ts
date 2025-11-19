export default class Property {
    public id: number;
    public name: string;
    public address: string;
    public rent: number;
    public type: string;
    public inventoryId: number;

    constructor(id: number, name: string, address: string, rent: number, type: string = "Appartement", inventoryId: number = 0) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.rent = rent;
        this.type = type;
        this.inventoryId = inventoryId;
    }
}