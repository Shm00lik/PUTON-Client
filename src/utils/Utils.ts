export class MovingAverage {
    private data: number[];
    private windowSize: number;
    private sum: number;

    constructor(windowSize: number) {
        this.data = [];
        this.windowSize = windowSize;
        this.sum = 0;
    }

    public add(value: number): void {
        this.data.push(value);
        this.sum += value;

        if (this.data.length > this.windowSize) {
            const removedValue = this.data.shift();
            this.sum -= removedValue!;
        }
    }

    public calculate(): number {
        if (this.data.length < this.windowSize) {
            return this.sum / this.data.length;
        } else {
            return this.sum / this.windowSize;
        }
    }

    public reset(): void {
        this.data = [];
        this.sum = 0;
    }
}

export enum Color {
    RED = "#cf3030",
    GREEN = "#51b52d",
    PRIMARY = "#15a288",
}

export class MeData {
    username: string;
    email: string;

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }
}
