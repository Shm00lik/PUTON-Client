import { HeartFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Flex, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { RouteOptions, route } from "../../App";
import CircledProduct from "../../components/CircledProduct";
import PoseDetectionComponent from "../../components/PoseDetection";
import Wishlist from "../../components/Wishlist";
import { Product } from "../../utils/Product";
import { Color } from "../../utils/Utils";
import Me from "../../components/Me";
import { Client } from "../../utils/Protocol";

const HomeView = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product>(
        Product.defaultProduct
    );

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [showMe, setShowMe] = useState<boolean>(false);
    const [showWishlist, setShowWishlist] = useState<boolean>(false);

    useEffect(() => {
        const runThis = async () => {
            let result = await Client.getInstance().request("/me", "GET");

            if (!result.success) {
                route(RouteOptions.LOGIN);
                return;
            }
        };

        runThis();
    }, []);

    useEffect(() => {
        Client.getInstance()
            .request("/products?amount=5&page=0", "GET")
            .then((d) => setProducts(Product.fromResponseArray(d)));
    }, []);

    return (
        <>
            <div style={{ position: "relative", height: "100vh" }}>
                <video
                    ref={videoRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain", // Ensures video doesn't stretch
                        transform: "scaleX(-1)",
                    }}
                    autoPlay
                />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain", // Ensures video doesn't stretch
                        transform: "scaleX(-1)",
                    }}
                />

                <PoseDetectionComponent
                    product={selectedProduct}
                    FPS={20}
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    forceStop={showMe || showWishlist}
                />

                <div
                    style={{
                        padding: 15,
                        paddingTop: 30,
                        top: 0,
                        left: 0,
                        position: "absolute",
                    }}
                >
                    <Flex vertical gap="middle">
                        <Flex
                            gap="middle"
                            justify="space-between"
                            style={{
                                width: "100%",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <Badge.Ribbon
                                text={selectedProduct != Product.defaultProduct ? selectedProduct.price  + "$": ""}
                                color={Color.PRIMARY}
                            >
                                <Avatar
                                    shape="square"
                                    size={64}
                                    style={{ width: 200 }}
                                    onClick={() => {
                                            if (selectedProduct != Product.defaultProduct) {
                                                route(RouteOptions.PRODUCT, {
                                                    id: selectedProduct.id,
                                                })
                                            }
                                        }
                                    }
                                >
                                    {selectedProduct.title}
                                </Avatar>
                            </Badge.Ribbon>

                            <Avatar
                                size={64}
                                icon={<UserOutlined />}
                                onClick={() => setShowMe(true)}
                                style={
                                    showMe
                                        ? { backgroundColor: Color.PRIMARY }
                                        : {}
                                }
                            />

                            <Avatar
                                size={64}
                                icon={
                                    <HeartFilled style={{ color: Color.RED }} />
                                }
                                onClick={() => setShowWishlist(true)}
                                style={
                                    showWishlist
                                        ? { backgroundColor: Color.PRIMARY }
                                        : {}
                                }
                            />
                        </Flex>

                        <Space direction="vertical" size={15}>
                            {products.map((p) => (
                                <CircledProduct
                                    onClick={(p) => setSelectedProduct(p)}
                                    product={p}
                                    isSelected={selectedProduct === p}
                                    withBorder
                                    withPriceBadget={false}
                                    key={p.id}
                                />
                            ))}
                        </Space>
                    </Flex>
                </div>
            </div>

            <Me show={showMe} setShow={setShowMe} />
            <Wishlist show={showWishlist} setShow={setShowWishlist} />
        </>
    );
};

export default HomeView;
