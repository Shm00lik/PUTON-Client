import { Row, Col } from "antd";
import React from "react";

const PageNotFoundView: React.FC = () => {
    return (
        <>
            <Row justify="center" align="middle" style={{ height: "100vh" }}>
                <Col>
                    <div style={{ width: "100vw", textAlign: "center" }}>
                        <img
                            src="./404image.png"
                            style={{ width: "100vw", height: "auto" }}
                        />

                        <div>
                            Try going back to
                            <span>
                                <a href="/"> The Home Page</a>
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default PageNotFoundView;
