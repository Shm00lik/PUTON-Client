import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../utils/Product";
import { useState } from "react";
import { Modal, Image, Button } from "antd";
import { RouteOptions, route } from "../App";

interface Props {
    product: Product | null;
}

const ProductComponent = ({ product }: Props) => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    if (product == null) {
        return <></>;
    }

    return (
        <>
            <Modal
                open={showOverlay}
                closable
                onCancel={() => setShowOverlay(false)}
                footer={null}
                centered
                style={{ textAlign: "center" }}
            >
                <h1>{product.title}</h1>

                <Image src={product.image.src} />

                <p style={{ color: "grey" }}>{product.description}</p>

                <Button
                    onClick={() =>
                        route(RouteOptions.PRODUCT, { id: product.id })
                    }
                >
                    View Product
                </Button>
            </Modal>

            <Card
                sx={{ width: 240, margin: 2 }}
                onClick={() => setShowOverlay(true)}
            >
                <CardMedia
                    sx={{ height: 140 }}
                    image={product.image.src}
                    title={product.title}
                />

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.title}
                    </Typography>

                    <Typography color="text.secondary">
                        {product.description}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default ProductComponent;
