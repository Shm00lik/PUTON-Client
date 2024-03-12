import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Register from "./views/register/Register";


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

export const MIN_USERNAME_LENGTH: number = 1;
export const MIN_PASSWORD_LENGTH: number = 1;
export const enum RoutesOptions {
    HOME = "/",
    LOGIN = "/login",    
    REGISTER = "/register",    
}
export const route = function(location: RoutesOptions) {
    window.location.href = location;
}

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <BrowserRouter>
                    <Routes>
                        <Route path={RoutesOptions.HOME} element={<Home />} />
                        <Route path={RoutesOptions.LOGIN} element={<Login />} />
                        <Route path={RoutesOptions.REGISTER} element={<Register />} />
                    </Routes>
                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
