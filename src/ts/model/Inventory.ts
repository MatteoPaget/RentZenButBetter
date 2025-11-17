export default class Inventory {
    public id: number;
    public name: string;
    public description: string;
    public date: string;

    constructor(id: number, name: string, description: string, date: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
    }
}