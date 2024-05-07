import { Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { Client } from "../utils/Protocol";
import { MeData } from "../utils/Utils";

interface Props {
    show: boolean;
    setShow: (state: boolean) => void;
}

const Wishlist = ({ show, setShow }: Props) => {
    const [data, setData] = useState<MeData | null>();

    useEffect(() => {
        if (!show) return;
        Client.me().then((d) => setData(d));
    }, [show]);

    return (
        <>
            <Modal
                title={<h2>✨ Me ✨</h2>}
                open={show}
                closable
                onCancel={() => setShow(false)}
                footer={null}
                centered
                style={{ textAlign: "center" }}
                styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
            >
                <Space direction="vertical">
                    {data?.username}
                    {data?.email}
                </Space>
            </Modal>
        </>
    );
};

export default Wishlist;
