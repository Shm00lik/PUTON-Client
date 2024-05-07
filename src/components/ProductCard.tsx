import { Avatar, Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import { Product } from "../utils/Product.ts";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import CircledProduct from "./CircledProduct.tsx";
import { Client } from "../utils/Protocol.ts";
import { Color } from "../utils/Utils.ts";
import { useState } from "react";

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
                                        Client.wishlistProduct(product);
                                        product.inWishlist = false;
                                        setN(n + 1);
                                    }}
                                    style={{ color: Color.RED }}
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={() => {
                                        Client.wishlistProduct(product);
                                        product.inWishlist = true;
                                        setN(n + 1);
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
