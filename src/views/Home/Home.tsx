import { useEffect } from "react";
import { RouteOptions, route } from "../../App";
import { Client, Response } from "../../utils/Protocol";

const HomeView = () => {
    useEffect(() => {
        const username: string | null = localStorage.getItem("username");
        const password: string | null = localStorage.getItem("password");

        if (username == null || password == null) {
            route(RouteOptions.LOGIN);
            return;
        }

        const runThis = async () => {
            const formData: {
                username: string;
                password: string;
            } = { username: username, password: password };

            let result: Response = await Client.login(formData);

            if (!result.body.success) {
                localStorage.removeItem("username");
                localStorage.removeItem("password");

                route(RouteOptions.LOGIN);
                return;
            }
        };

        runThis();
    }, []);

    return <></>;
};

export default HomeView;
