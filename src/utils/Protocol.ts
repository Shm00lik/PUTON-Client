import { Product } from "./Product";

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export class Client {
    public static HOST: string = "http://localhost";
    public static PORT: number = 3339;
    public static baseURL: string = `${Client.HOST}:${Client.PORT}`;

    private static async request(url: string, method: string, body?: string) {
        if (method == "POST") {
            return await fetch(Client.baseURL + url, {
                method: method,
                body: body,
                headers: {
                    token: localStorage.getItem("token") || "",
                },
            });
        }

        return await fetch(Client.baseURL + url, {
            method: method,
            headers: {
                token: localStorage.getItem("token") || "",
            },
        });
    }
            
    public static async me(): Promise<Response> {
        let response = await this.request("/me", "GET");

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async login(formData: LoginData): Promise<Response> {
        let response = await this.request("/login", "POST", JSON.stringify(formData));
        
        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async register(formData: RegisterData): Promise<Response> {
        let response = await this.request("/register", "POST", JSON.stringify(formData))

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async logout(): Promise<Response> {
        // localStorage.clear();

        return new Response(200, true, JSON.stringify({ success: true }), "/");
    }

    public static async wishlist(): Promise<Product[]> {
        let response = await this.request("/wishlist", "GET")

        let parsedResponse: Response = new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );

        let products: Product[] = [];

        if (!parsedResponse.body.success) {
            return products;
        }

        parsedResponse.body.message.forEach((product: any) => {
            products.push(
                new Product(
                    product.productID,
                    product.title,
                    product.description,
                    product.price,
                    product.image
                )
            );
        });

        return products;
    }

    public static async product(
        id: Number | string | null
    ): Promise<Product | null> {
        let response = await this.request("/product/" + id, "GET")

        let parsedResponse = new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );

        if (!parsedResponse.body.success) {
            return null;
        }

        return new Product(
            parsedResponse.body.message.productID,
            parsedResponse.body.message.title,
            parsedResponse.body.message.description,
            parsedResponse.body.message.price,
            parsedResponse.body.message.image
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
