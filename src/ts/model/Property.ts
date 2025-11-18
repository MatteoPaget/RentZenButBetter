export default class Property {
    public id: number;
    public name: string;
    public address: string;
    public rent: number;

    constructor(id: number, name: string, address: string, rent: number) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.rent = rent;
    }
}