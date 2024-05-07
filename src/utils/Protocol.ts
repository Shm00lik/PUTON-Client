import { Product } from "./Product";
import { MeData } from "./Utils";

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
    public static HOST: string = "http://192.168.1.37";
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

    public static async ping(): Promise<Response> {
        let response = await this.request("/ping", "POST");

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async me(): Promise<MeData | null> {
        let response = await this.request("/me", "GET");

        let parsedResponse = new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );

        if (!parsedResponse.body.success) {
            return null;
        }

        return new MeData(
            parsedResponse.body.message.username,
            parsedResponse.body.message.email
        );
    }

    public static async login(formData: LoginData): Promise<Response> {
        let response = await this.request(
            "/login",
            "POST",
            JSON.stringify(formData)
        );

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async register(formData: RegisterData): Promise<Response> {
        let response = await this.request(
            "/register",
            "POST",
            JSON.stringify(formData)
        );

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
        let response = await this.request("/wishlist", "GET");

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
                    product.image,
                    product.inWishlist
                )
            );
        });

        return products;
    }

    public static async product(id: number | string): Promise<Product | null> {
        let response = await this.request("/product/" + id, "GET");

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
            parsedResponse.body.message.image,
            parsedResponse.body.message.inWishlist,
            parsedResponse.body.message.leftEyeX,
            parsedResponse.body.message.leftEyeY,
            parsedResponse.body.message.rightEyeX,
            parsedResponse.body.message.rightEyeY
        );
    }

    public static async wishlistProduct(product: Product): Promise<Response> {
        let response = await this.request(
            "/wishlistProduct",
            "POST",
            JSON.stringify({
                id: product.id,
            })
        );

        return new Response(
            response.status,
            response.ok,
            await response.text(),
            response.url
        );
    }

    public static async products(
        amount: number,
        page: number
    ): Promise<Product[]> {
        let response = await this.request(
            `/products?amount=${amount}&page=${page}`,
            "GET"
        );

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
                    product.image,
                    product.inWishlist,
                    product.leftEyeX,
                    product.leftEyeY,
                    product.rightEyeX,
                    product.rightEyeY
                )
            );
        });

        return products;
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
