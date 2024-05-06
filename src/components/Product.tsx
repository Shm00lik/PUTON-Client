import { CardContent, CardMedia, Typography } from "@mui/material";
import { Card, Button, Col, Image, Modal, Row } from "antd";
import { useState } from "react";
import { RouteOptions, route } from "../App";
import { Product } from "../utils/Product";

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
                    TRY IT!
                </Button>
            </Modal>

            <Card hoverable onClick={() => setShowOverlay(true)}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={product.image.src}
                    title={product.title}
                />

                <CardContent>
                    <Row>
                        <Col>
                            <h2>{product.title}</h2>
                        </Col>
                        <Col>hi</Col>
                    </Row>
                    {product.description}
                </CardContent>
            </Card>
        </>
    );
};

export default ProductComponent;
