export class Product {
    id: Number;
    title: string;
    description: string;
    price: Number;
    image: string;

    constructor(id: Number, title: string, description: string, price: Number, image: string) {
        console.log("CREATED PRODUCT " + title);
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.image = image;
    }

    public hi() : string {
        return this.title;
    }
}