const API_URL = "https://10.128.207.44:8081";
export default class UserDAO {
    async login(email, pass) {
        try {
            // Construction propre de l'URL
            const url = new URL(`${API_URL}/User/Login`);
            url.searchParams.append("email", email);
            url.searchParams.append("passwd", pass);
            const response = await fetch(url.toString(), {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                return data.token || null;
            }
            else {
                console.error("Erreur API:", response.statusText);
                return null;
            }
        }
        catch (error) {
            console.error("Erreur réseau:", error);
            return null;
        }
    }
}
