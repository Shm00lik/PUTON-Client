import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { route, RouteOptions } from "../../App";
import { Product } from "../../utils/Product";
import { Client } from "../../utils/Protocol";
import { Image } from "antd";

const ProductView = () => {
    const { id } = useParams<string>();

    if (isNaN(Number(id))) {
        route(RouteOptions.HOME);
    }

    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        Client.product(Number(id)).then((p) => setProduct(p));
    }, []);

    if (product == null) {
        return <>Loading...</>;
    }

    return (
        <>
            <h1>{product.title}</h1>
            <Image src={product.image.src} />
            <h2>{product.description}</h2>
        </>
    );
};

export default ProductView;
