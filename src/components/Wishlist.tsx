import { Modal, Space } from "antd";
import { Product } from "../utils/Product";
import { Client } from "../utils/Protocol";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { route, RouteOptions } from "../App";

interface Props {
    show: boolean;
    setShow: (state: boolean) => void;
}

const Wishlist = ({ show, setShow }: Props) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    useEffect(() => {
        if (!show) return;
        Client.getInstance()
            .request("/wishlist", "GET")
            .then((d) => setWishlist(Product.fromResponseArray(d)));
    }, [show]);

    return (
        <>
            <Modal
                title={<h2>✨ Wishlist ✨</h2>}
                open={show}
                closable
                onCancel={() => setShow(false)}
                footer={null}
                centered
                style={{ textAlign: "center" }}
                styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
            >
                <Space direction="vertical">
                    {wishlist.map((product) => (
                        <ProductCard
                            product={product}
                            key={product.id}
                            onClick={() =>
                                route(RouteOptions.PRODUCT, {
                                    id: product.id,
                                })
                            }
                        />
                    ))}
                </Space>
            </Modal>
        </>
    );
};

export default Wishlist;
