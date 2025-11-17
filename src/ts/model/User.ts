export default class User {
    public firstName: string;
    public lastName: string;
    public email: string;
    public role: string;

    constructor(firstName: string, lastName: string, email: string, role: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}