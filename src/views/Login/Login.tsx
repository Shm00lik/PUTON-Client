import {
    Alert,
    AlertColor,
    Button,
    Grid,
    Snackbar,
    TextField,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, route, RoutesOptions } from "../../App";
import { Client, Response } from "../../utils/Protocol";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [isAlertOpen, setAlertIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState<AlertColor>("error");

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();

        let result: Response = await Client.login(formData);

        if (!result.body.success) {
            handleAlert(result.body.message, "error");
            return;
        }

        localStorage.setItem("username", formData.username);
        localStorage.setItem("password", formData.password);

        handleAlert(result.body.message, "success");

        route(RoutesOptions.HOME);
    };

    const handleAlert = (message: string, alertColor: AlertColor) => {
        setAlertIsOpen(true);
        setAlertColor(alertColor);
        setAlertMessage(message);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Login</h1>

            <Grid container direction={"column"} spacing={2}>
                <Grid item>
                    <TextField
                        label="Username"
                        name="username"
                        onChange={handleChange}
                        value={formData.username}
                        inputProps={{ minLength: MIN_USERNAME_LENGTH }}
                        required
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        inputProps={{ minLength: MIN_PASSWORD_LENGTH }}
                        required
                    />
                </Grid>

                <Grid item>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>

            <Snackbar
                open={isAlertOpen}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                autoHideDuration={5000}
                ClickAwayListenerProps={{ mouseEvent: false }}
                onClose={() => setAlertIsOpen(false)}
            >
                <Alert severity={alertColor} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;
