import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { route, RouteOptions } from "../../App";
import { Product } from "../../utils/Product";
import { Client } from "../../utils/Protocol";
import { Image } from "antd";
import { Color } from "../../utils/Utils";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const ProductView = () => {
    const { id } = useParams<string>();

    if (isNaN(Number(id))) {
        route(RouteOptions.HOME);
    }

    const [product, setProduct] = useState<Product | null>(null);
    const [n, setN] = useState<number>(0);

    useEffect(() => {
        Client.getInstance()
            .request("/product/" + id, "GET")
            .then((p) => {
                if (!p.success) {
                    route(RouteOptions.HOME);
                }
                setProduct(Product.fromResponse(p));
            });
    }, []);

    if (product == null) {
        return <>Loading...</>;
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>{product.title}</h1>
            <Image src={product.image.src} />
            <h2>{product.description}</h2>

            {product.inWishlist ? (
                <HeartFilled
                    onClick={() => {
                        Client.getInstance()
                            .request("/wishlistProduct", "POST", {
                                id: product.id,
                            })
                            .then(() => {
                                product.inWishlist = false;
                                setN(n + 1);
                            });
                    }}
                    style={{ color: Color.RED, fontSize: "50px" }}
                />
            ) : (
                <HeartOutlined
                    onClick={() => {
                        Client.getInstance()
                            .request("/wishlistProduct", "POST", {
                                id: product.id,
                            })
                            .then(() => {
                                product.inWishlist = true;
                                setN(n + 1);
                            });
                    }}
                    style={{ color: Color.RED, fontSize: "50px" }}
                />
            )}
        </div>
    );
};

export default ProductView;
