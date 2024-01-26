export class Client {
    public static HOST: string = "http://localhost";
    public static PORT: number = 3339;

    public static async login(
        username: string,
        password: string
    ): Promise<Response> {
        let response = await fetch("http://localhost:3339/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
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
        let response = await fetch("http://localhost:3339/register", {
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