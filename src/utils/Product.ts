export class Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: HTMLImageElement;
    inWishlist: boolean;
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };

    constructor(
        id: number,
        title: string,
        description: string,
        price: number,
        image: string,
        inWishlist: boolean,
        leftEyeX: number = 0,
        leftEyeY: number = 0,
        rightEyeX: number = 0,
        rightEyeY: number = 0
    ) {
        console.log("CREATED PRODUCT " + title);
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.image = new Image();
        this.image.src = "data:image/jpg;base64," + image;
        this.inWishlist = inWishlist;
        this.leftEye = { x: leftEyeX, y: leftEyeY };
        this.rightEye = { x: rightEyeX, y: rightEyeY };
    }
}
