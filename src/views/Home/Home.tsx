import { useEffect, useState } from "react";
import { Client, Response } from "../../utils/Protocol";


const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const runThis = async () => {
            let result: Response = await Client.login(localStorage.getItem("username"), localStorage.getItem("username"));

            if (!result.body.success) {
                window.location.href = "/login"
                return;
            }

            setIsLoggedIn(true);
        };

        runThis();
    }, []);

    return (
        <>
            {!isLoggedIn ? <></> : <h1>Hello, World!</h1>}
        </>

    );
};

export default Home;
