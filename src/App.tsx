import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Client } from "./utils/Protocol";
import HomeView from "./views/home/HomeView";
import LoginView from "./views/login/LoginView";
import RegisterView from "./views/register/RegisterView";
import PingView from "./views/test/Ping";
import ProductView from "./views/product/ProductView";
import Test from "./views/test/Test";

const theme = createTheme({
    typography: {
        fontFamily: "Heebo",
    },

    palette: {
        mode: "light",

        primary: {
            main: "#18A48C",
        },
        secondary: {
            main: "#42B8A3",
        },

        background: {
            default: "#333339",
        },
    },
});

export const enum RouteOptions {
    HOME = "/",
    LOGIN = "/login",
    REGISTER = "/register",
    WISHLIST = "/wishlist",
    PRODUCT = "/product/:id",
    PING = "/ping",
    NOT_FOUND = "*",
    TEST = "/test",
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
    return (
        <div className="portraitScreen">
            <ThemeProvider theme={theme}>
                <CssBaseline>
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
                                path={RouteOptions.PRODUCT}
                                element={<ProductView />}
                            />

                            <Route
                                path={RouteOptions.PING}
                                element={<PingView />}
                            />

                            <Route
                                path={RouteOptions.TEST}
                                element={<Test />}
                            />

                            <Route
                                path={RouteOptions.NOT_FOUND}
                                element={<HomeView />}
                            />
                        </Routes>
                    </BrowserRouter>
                </CssBaseline>
            </ThemeProvider>
        </div>
    );
}

export default App;
