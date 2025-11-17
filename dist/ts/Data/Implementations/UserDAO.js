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
const API_URL = "https://10.128.207.44:8081";
class UserDAO {
    login(email, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Construction propre de l'URL
                const url = new URL(`${API_URL}/User/Login`);
                url.searchParams.append("email", email);
                url.searchParams.append("passwd", pass);
                const response = yield fetch(url.toString(), {
                    method: "GET",
                });
                if (response.ok) {
                    const data = yield response.json();
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
        });
    }
}
exports.default = UserDAO;
