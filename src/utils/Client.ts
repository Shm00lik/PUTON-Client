import axios from "axios";

export class Client {
    public static HOST: string = "http://localhost";
    public static PORT: number = 3339;

    public static async login(username: string, password: string) {
        let request = await fetch("http://localhost:3339/", {
            method: "GET",
            // body: JSON.stringify({ username, password }),
            // headers: {
            //     "Content-Type": "application/json",
            // },
            mode: "no-cors",
        });

        console.log(request);

        return request.text();
    }
}
