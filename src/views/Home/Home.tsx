import { useEffect, useState } from "react";
import { Client, Response } from "../../utils/Protocol";


const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const username: string | null = localStorage.getItem("username");
        const password: string | null = localStorage.getItem("password");

        if (username == null || password == null) {
            window.location.href = "/login"
            return;
        }

        const runThis = async () => {
            const formData: {
                username: string;
                password: string;
            } = { "username": username, "password": password };

            let result: Response = await Client.login(formData);

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
