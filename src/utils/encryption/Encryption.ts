import { Client } from "../Protocol";
import DiffieHellman from "./DiffieHellman";
import * as CryptoJS from "crypto-js";

class Encryption {
    public encryptionToken: string;
    public diffieHellman: DiffieHellman | null;
    public sharedKey: string;
    public isReady: boolean;

    public constructor() {
        this.encryptionToken = Encryption.generateEncryptionToken();
        this.diffieHellman = null;
        this.sharedKey = "";
        this.isReady = false;
    }

    public async initialize(): Promise<boolean> {
        const response = await Client.getInstance().request(
            "/handshake/init",
            "POST",
            { encryptionToken: this.encryptionToken },
            false
        );

        if (!response.success) {
            return false;
        }

        const params: { g: number; p: number } = {
            g: Number(response.g),
            p: Number(response.p),
        };

        this.diffieHellman = new DiffieHellman(params.g, params.p);
        console.log(params.g, params.p);

        return true;
    }

    public async exchange(): Promise<boolean> {
        if (this.diffieHellman == null) {
            return false;
        }

        const publicKey = this.diffieHellman.generatePublicKey();

        let response = await Client.getInstance().request(
            "/handshake/exchange",
            "POST",
            {
                encryptionToken: this.encryptionToken,
                publicKey: publicKey,
            },
            false
        );

        if (!response.success) {
            return false;
        }

        const sharedKey = this.diffieHellman.generateSharedKey(
            Number(response.serverPublicKey)
        );

        console.warn(sharedKey);

        this.sharedKey = Encryption.diffieHellmanKeyToAES(sharedKey.toString());

        this.isReady = true;

        return true;
    }

    public encrypt(data: string): string {
        if (!this.isReady) {
            return "";
        }

        return CryptoJS.AES.encrypt(
            data,
            CryptoJS.enc.Hex.parse(this.sharedKey),
            {
                mode: CryptoJS.mode.ECB,
            }
        ).ciphertext.toString(CryptoJS.enc.Hex);
    }

    public decrypt(data: string): string {
        if (!this.isReady) {
            return "";
        }

        return CryptoJS.AES.decrypt(
            CryptoJS.enc.Hex.parse(data).toString(CryptoJS.enc.Base64),
            CryptoJS.enc.Hex.parse(this.sharedKey),
            {
                mode: CryptoJS.mode.ECB,
            }
        ).toString(CryptoJS.enc.Utf8);
    }

    public static generateEncryptionToken(): string {
        return Math.floor(Math.random() * 100000).toString();
    }

    public static sha256(data: string): string {
        return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    }

    public static diffieHellmanKeyToAES(diffieHellmanKey: string): string {
        return Encryption.sha256(diffieHellmanKey);
    }
}

export default Encryption;
