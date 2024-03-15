import { Product } from "./Product";


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
            body: JSON.stringify(formData)
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
        // document.cookie = 'Token;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        return new Response(
            200,
            true,
            JSON.stringify({success: true}),
            "/"
        )
    }

    public static async wishlist(): Promise<(Product | null)[]> {
        let response = await fetch(Client.baseURL + "/wishlist", {
            method: "GET",
            headers: {
                Token: document.cookie.split("=")[1],
            }
        });

        let parsedResponse: Response = new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );

        let products: (Product | null)[] = [];
        
        if (!parsedResponse.body.success) {
            return products;
        }


        parsedResponse.body.message.forEach(async (p: Number) => {
            products.push(await Client.product(p))
        });

        return products
    }

    public static async product(id: Number | string | null): Promise<Product | null> {
        let response = await fetch(Client.baseURL + "/product/" + id, {
            method: "GET",
            headers: {
                Token: document.cookie.split("=")[1],
            }
        });

        let parsedResponse = new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );

        console.log(parsedResponse)

        if (!parsedResponse.body.success) {
            return null;
        }

        return new Product(
            parsedResponse.body.message.productID,
            parsedResponse.body.message.title,
            parsedResponse.body.message.description,
            parsedResponse.body.message.price,
            parsedResponse.body.message.image,
        )
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
