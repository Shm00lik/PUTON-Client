import { useEffect } from "react";
import { Client } from "../../utils/Protocol";

const Test = () => {
    console.log("HI")
    
    useEffect(() => {
        const init = async () => {
            await Client.initializeEncryption();
        };

        init();
    }, []);

    return <>Hello</>;
};

export default Test;
