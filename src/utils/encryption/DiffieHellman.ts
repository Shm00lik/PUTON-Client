class DiffieHellman {
    G: number;
    P: number;
    privateKey: number;

    constructor(g: number, p: number) {
        this.G = g;
        this.P = p;
        this.privateKey = this.generatePrivateKey();
    }

    public generatePrivateKey(): number {
        return Math.floor(Math.random() * 10) + 10;
    }

    public generatePublicKey(): number {
        return Math.pow(this.G, this.privateKey) % this.P;
    }

    public generateSharedKey(otherPublicKey: number): number {
        console.log(
            `Server Key: ${otherPublicKey}, Client Key: ${this.privateKey}, p: ${this.P}`
        );
        return Math.pow(otherPublicKey, this.privateKey) % this.P;
    }
}

export default DiffieHellman;
