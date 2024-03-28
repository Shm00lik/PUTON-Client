import { useParams } from "react-router-dom";
import { Client } from "../../utils/Protocol";
import { Product } from "../../utils/Product";
import { useEffect, useState } from "react";
import ProductComponent from "../../components/Product";
import { RouteOptions, route } from "../../App";

const ProductView = () => {
    const { id } = useParams<string>();

    if (isNaN(id)) {
        route(RouteOptions.HOME);
    }

    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        Client.product(Number(id)).then((p) => setProduct(p));
    }, []);

    return (
        <>
            <ProductComponent product={product} />
        </>
    );
};

export default ProductView;
