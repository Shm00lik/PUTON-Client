import { useEffect } from "react";
import { Client } from "../../utils/Protocol";

const Test = () => {
    console.log("HI");

    const runThis = () => {
        Client.getInstance()
            .request("/me", "GET")
            .then((d) => console.log(d));
    };

    const runThis2 = () => {
        Client.getInstance()
            .request("/product/123", "GET")
            .then((d) => console.log(d));
    };

    return (
        <>
            <div onClick={runThis}>Hello</div>
            <div onClick={runThis2}>Hello2</div>
        </>
    );
};

export default Test;
