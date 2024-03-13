import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Register from "./views/register/Register";
import Wishlist from "./views/wishlist/Wishlist";
import Appbar from "./components/Appbar";


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
    WISHLIST = "/wishlist"
}
export const route = function (location: RouteOptions) {
    window.location.href = location;
}

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                
                <Appbar />

                <BrowserRouter>
                    <Routes>
                        <Route path={RouteOptions.HOME} element={<Home />} />
                        <Route path={RouteOptions.LOGIN} element={<Login />} />
                        <Route path={RouteOptions.REGISTER} element={<Register />} />
                        <Route path={RouteOptions.WISHLIST} element={<Wishlist />} />
                    </Routes>
                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
