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
        this.inWishlist = true;
        this.leftEye = { x: leftEyeX, y: leftEyeY };
        this.rightEye = { x: rightEyeX, y: rightEyeY };
    }

    public static fromResponse(
        data: {
            success: boolean;
        } & any
    ): Product {
        return new Product(
            data.productID,
            data.title,
            data.description,
            data.price,
            data.image,
            data.leftEyeX,
            data.leftEyeY,
            data.rightEyeX,
            data.rightEyeY
        );
    }

    public static fromResponseArray(
        data: {
            success: boolean;
        } & any
    ): Product[] {
        const products: Product[] = [];

        data.data.forEach((p: any) => products.push(Product.fromResponse(p)));

        return products;
    }
}
