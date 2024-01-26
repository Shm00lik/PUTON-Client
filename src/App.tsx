import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import Login from "./views/Login/Login";
import Register from "./views/Register/Register";

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

function App() {
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline>
                    <Register />
                </CssBaseline>
            </ThemeProvider>
        </>
    );
}

export default App;
