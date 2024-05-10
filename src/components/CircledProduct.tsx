import { Avatar, Badge } from "antd";
import { Product } from "../utils/Product.ts";
import { Color } from "../utils/Utils.ts";

interface Props {
    product: Product;
    onClick: (product: Product) => void;
    isSelected: boolean;
    withBorder: boolean;
    withPriceBadget: boolean;
}

const CircledProduct = ({
    product,
    onClick,
    isSelected,
    withBorder = true,
    withPriceBadget = false,
}: Props) => {
    const getBorderColor = (): Color => {
        return isSelected ? Color.GREEN : Color.RED;
    };

    const getAvatar = () => {
        return (
            <Avatar
                size={80}
                style={
                    withBorder
                        ? {
                              border: "2px solid " + getBorderColor(),
                              backdropFilter: "blur(10px)",
                              backgroundColor: "rgb(255, 255, 255, 0.2)",
                          }
                        : {}
                }
                onClick={() => onClick(product)}
            >
                <img src={product.image.src} style={{ width: "100%" }} />
            </Avatar>
        );
    };

    return (
        <>
            {withPriceBadget ? (
                <Badge.Ribbon text={product.price} color={Color.PRIMARY}>
                    {getAvatar()}
                </Badge.Ribbon>
            ) : (
                getAvatar()
            )}
        </>
    );
};

export default CircledProduct;
