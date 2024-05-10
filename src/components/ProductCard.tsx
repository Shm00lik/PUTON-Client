import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import { useState } from "react";
import { Product } from "../utils/Product.ts";
import { Client } from "../utils/Protocol.ts";
import { Color } from "../utils/Utils.ts";
import CircledProduct from "./CircledProduct.tsx";

interface Props {
    product: Product;
    onClick: () => void;
}

const ProductCard = ({ product, onClick }: Props) => {
    const [n, setN] = useState<number>(0);

    return (
        <>
            <Card hoverable>
                <Meta
                    title={
                        <Flex gap="middle" justify="space-between">
                            {product.title}

                            {product.inWishlist ? (
                                <HeartFilled
                                    onClick={() => {
                                        Client.getInstance()
                                            .request(
                                                "/wishlistProduct",
                                                "POST",
                                                { id: product.id }
                                            )
                                            .then(() => {
                                                product.inWishlist = false;
                                                setN(n + 1);
                                            });
                                    }}
                                    style={{ color: Color.RED }}
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={() => {
                                        Client.getInstance()
                                            .request(
                                                "/wishlistProduct",
                                                "POST",
                                                { id: product.id }
                                            )
                                            .then(() => {
                                                product.inWishlist = true;
                                                setN(n + 1);
                                            });
                                    }}
                                    style={{ color: Color.RED }}
                                />
                            )}
                        </Flex>
                    }
                    description={product.description}
                    avatar={
                        <CircledProduct
                            product={product}
                            onClick={() => {}}
                            isSelected={false}
                            withBorder={false}
                            withPriceBadget
                        />
                    }
                />
            </Card>
        </>
    );
};

export default ProductCard;
