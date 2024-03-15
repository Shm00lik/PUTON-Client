export class Client {
    public static HOST: string = "http://localhost";
    public static PORT: number = 3339;
    public static baseURL: string = `${Client.HOST}:${Client.PORT}`;

    public static async login(formData: {
        username: string;
        password: string;
    }): Promise<Response> {
        let response = await fetch(Client.baseURL + "/login", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async register(formData: {
        email: string;
        username: string;
        password: string;
    }): Promise<Response> {
        let response = await fetch(Client.baseURL + "/register", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async logout(): Promise<Response> {
        // localStorage.clear();
        
        return new Response(
            200,
            true,
            JSON.stringify({success: true}),
            "/"
        )
    }

    public static async getWishlist(username: string | null): Promise<Response> {
        let response = await fetch(Client.baseURL + "/getWishlist?username=" + username, {
            method: "GET",
        });

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }
}

export class Response {
    public status: number;
    public ok: boolean;
    public body: any;
    public url: string;

    constructor(status: number, ok: boolean, body: string, url: string) {
        this.status = status;
        this.ok = ok;
        this.body = JSON.parse(body);
        this.url = url;
    }
}
