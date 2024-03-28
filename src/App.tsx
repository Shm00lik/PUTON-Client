import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Appbar from "./components/Appbar";
import HomeView from "./views/home/Home";
import LoginView from "./views/login/Login";
import RegisterView from "./views/register/Register";
import WishlistView from "./views/wishlist/Wishlist";
import ProductView from "./views/product/Product";

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
}
export const route = function (location: RouteOptions) {
    window.location.href = location;
};

function App() {
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
                    </Routes>
                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
