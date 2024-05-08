import { Client } from "../Protocol";
import DiffieHellman from "./DiffieHellman";
import * as CryptoJS from "crypto-js";

class Encryption {
    encryptionToken: string;
    diffieHellman: DiffieHellman | null;
    sharedKey: string;
    isReady: boolean;

    constructor() {
        this.encryptionToken = "";
        this.diffieHellman = null;
        this.sharedKey = "";
        this.isReady = false;
    }

    public async initialize(): Promise<boolean> {
        let encryptionToken = Math.floor(Math.random() * 100000).toString();

        this.encryptionToken = encryptionToken;

        const response = (await Client.handshakeInit(encryptionToken)).body;

        if (!response.success) {
            return false;
        }

        const params: { g: number; p: number } = {
            g: response.message.g,
            p: response.message.p,
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

        const response = (
            await Client.handshakeExchange(
                this.encryptionToken,
                publicKey.toString()
            )
        ).body;

        if (!response.success) {
            return false;
        }

        const sharedKey = this.diffieHellman.generateSharedKey(
            response.message.serverPublicKey
        );

        console.warn(sharedKey);

        this.sharedKey = Encryption.diffieHellmanKeyToAES(sharedKey.toString());

        this.isReady = true;

        return true;
    }

    public static diffieHellmanKeyToAES(diffieHellmanKey: string): string {
        return Encryption.sha256(diffieHellmanKey);
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

    public static sha256(data: string): string {
        return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    }
}

export default Encryption;
