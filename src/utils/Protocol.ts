import Encryption from "./encryption/Encryption";

export class Client {
    public static HOST: string = "192.168.1.37";
    public static PORT: number = 3339;
    public static baseURL: string = `http://${Client.HOST}:${Client.PORT}`;
    public static ENCRYPTED: boolean = true;
    private encryption: Encryption;

    private static instance: Client;

    private requestsQueue: {
        request: RequestData;
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
    }[] = [];

    private constructor() {
        this.encryption = new Encryption();
    }

    public static getInstance(): Client {
        if (!Client.instance) {
            Client.instance = new Client();

            if (Client.ENCRYPTED) {
                Client.instance.initializeEncryption();
            }
        }

        return Client.instance;
    }

    public async initializeEncryption() {
        await this.encryption.initialize();
        await this.encryption.exchange();

        if (this.encryption.isReady) {
            console.warn(this.encryption.sharedKey);
            await this.processQueuedRequests();
        }
    }

    private async processQueuedRequests() {
        while (this.requestsQueue.length > 0) {
            const { request, resolve, reject } = this.requestsQueue.shift()!;

            try {
                const result = await this.sendRequest(request);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    }

    public async request(
        url: string,
        method: string,
        body: {} = {},
        encrypt: boolean = Client.ENCRYPTED
    ): Promise<{ success: boolean } & { [key: string]: string }> {
        if (!encrypt || this.encryption.isReady) {
            return this.sendRequest(
                new RequestData(url, method, body, encrypt)
            );
        }

        return new Promise((resolve, reject) => {
            this.requestsQueue.push({
                request: new RequestData(url, method, body, encrypt),
                resolve,
                reject,
            });
        });
    }

    public async sendRequest(
        requestData: RequestData
    ): Promise<{ success: boolean } & any> {
        let response = null;

        if (requestData.method == "POST") {
            const requestBody = requestData.encrypt
                ? this.encryption.encrypt(JSON.stringify(requestData.body))
                : JSON.stringify(requestData.body);

            response = await fetch(Client.baseURL + requestData.url, {
                method: requestData.method,
                body: requestBody,
                headers: this.getHeaders(requestData.encrypt),
            });
        } else {
            response = await fetch(Client.baseURL + requestData.url, {
                method: requestData.method,
                headers: this.getHeaders(requestData.encrypt),
            });
        }

        const responseBody = await response.text();

        console.log(
            JSON.parse(
                requestData.encrypt
                    ? this.encryption.decrypt(responseBody)
                    : responseBody
            )
        );

        return JSON.parse(
            requestData.encrypt
                ? this.encryption.decrypt(responseBody)
                : responseBody
        );
    }

    public getHeaders(encrypted: boolean): {} {
        if (encrypted) {
            return {
                token: localStorage.getItem("token") || "",
                encryptionToken: this.encryption.encryptionToken,
            };
        }

        return {
            token: localStorage.getItem("token") || "",
        };
    }
}

class RequestData {
    public constructor(
        public url: string,
        public method: string,
        public body: {},
        public encrypt: boolean = Client.ENCRYPTED
    ) {}
}
Client.getInstance();
