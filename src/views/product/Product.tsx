import { useParams } from "react-router-dom";
import { Client } from "../../utils/Protocol";
import { Product } from "../../utils/Product";
import { useEffect, useState } from "react";
import ProductComponent from "../../components/Product";
import { RouteOptions, route } from "../../App";
import { Affix, Col, Row } from "antd";
import "./Product.css";
import PoseDetectionComponent from "../../components/PoseDetection";
const ProductView = () => {
    const { id } = useParams<string>();

    if (isNaN(Number(id))) {
        route(RouteOptions.HOME);
    }

    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        Client.product(Number(id)).then((p) => setProduct(p));
    }, []);

    return (
        <>
            <PoseDetectionComponent product={product} />
        </>
    );
};

export default ProductView;
