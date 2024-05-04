import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appbar from "./components/Appbar";
import HomeView from "./views/home/Home";
import LoginView from "./views/login/Login";
import RegisterView from "./views/register/Register";
import WishlistView from "./views/wishlist/Wishlist";
import ProductView from "./views/product/Product";
import Ping from "./views/test/Ping";
import PoseDetectionComponent from "./components/PoseDetection";

import { useEffect } from "react";
import { Client, Response } from "./utils/Protocol";

const darkTheme = createTheme({
    typography: {
        fontFamily: "Heebo",
    },

    palette: {
        mode: "dark",

        primary: {
            main: "#18A48C",
        },
        secondary: {
            main: "#42B8A3",
        },
    },
});

export const MIN_USERNAME_LENGTH: number = 6;
export const MIN_PASSWORD_LENGTH: number = 6;

export const enum RouteOptions {
    HOME = "/",
    LOGIN = "/login",
    REGISTER = "/register",
    WISHLIST = "/wishlist",
    PRODUCT = "/product/:id",
    TEST_AR = "/test/ar",
    PING = "/ping",
}

export const route = function (
    location: RouteOptions,
    params: { [key: string]: any } = {}
) {
    let url: string = location;

    Object.keys(params).forEach((key) => {
        url = url.replace(":" + key, params[key]);
    });

    window.location.href = url;
};

function App() {
    useEffect(() => {
        if (
            window.location.pathname == RouteOptions.LOGIN ||
            window.location.pathname == RouteOptions.REGISTER
        )
            return;

        const runThis = async () => {
            let result: Response = await Client.me();

            if (!result.body.success) {
                route(RouteOptions.LOGIN);
                return;
            }
        };

        runThis();
    }, [window.location.href]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <Appbar />

                <BrowserRouter>
                    <Routes>
                        <Route
                            path={RouteOptions.HOME}
                            element={<HomeView />}
                        />
                        <Route
                            path={RouteOptions.LOGIN}
                            element={<LoginView />}
                        />
                        <Route
                            path={RouteOptions.REGISTER}
                            element={<RegisterView />}
                        />
                        <Route
                            path={RouteOptions.WISHLIST}
                            element={<WishlistView />}
                        />
                        <Route
                            path={RouteOptions.PRODUCT}
                            element={<ProductView />}
                        />
                        <Route
                            path={RouteOptions.TEST_AR}
                            element={
                                <PoseDetectionComponent
                                    onDetection={() => {}}
                                />
                            }
                        />
                        <Route path={RouteOptions.PING} element={<Ping />} />
                    </Routes>
                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
