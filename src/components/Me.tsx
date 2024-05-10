import { Button, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { Client } from "../utils/Protocol";
import { RouteOptions, route } from "../App";

interface Props {
    show: boolean;
    setShow: (state: boolean) => void;
}

const Wishlist = ({ show, setShow }: Props) => {
    const [data, setData] = useState<{ username: string; email: string }>({
        username: "",
        email: "",
    });

    const logout = () => {
        localStorage.clear();

        route(RouteOptions.LOGIN);
    };

    useEffect(() => {
        if (!show) return;
        Client.getInstance()
            .request("/me", "GET")
            .then((d) => setData({ username: d.username, email: d.email }));
    }, [show]);

    return (
        <>
            <Modal
                title={<h2>✨ Me ✨</h2>}
                open={show}
                closable
                onCancel={() => setShow(false)}
                footer={<Button onClick={logout}>LOGOUT</Button>}
                centered
                style={{ textAlign: "center" }}
                styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
            >
                <Space direction="vertical">
                    <div>Username: {data.username}</div>

                    <div>Email: {data.email}</div>
                </Space>
            </Modal>
        </>
    );
};

export default Wishlist;
