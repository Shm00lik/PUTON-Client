import {
    Alert,
    AlertColor,
    Button,
    Grid,
    Snackbar,
    TextField,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { RouteOptions, route } from "../../App";
import { Client } from "../../utils/Protocol";
import {
    MIN_USERNAME_LENGTH,
    MIN_PASSWORD_LENGTH,
} from "../register/RegisterView";
import Encryption from "../../utils/encryption/Encryption";

const LoginView = () => {
    const [formData, setFormData] = useState<{
        username: string;
        password: string;
    }>({
        username: "yoav1234",
        password: "yoav1234",
    });

    const [isAlertOpen, setAlertIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState<AlertColor>("error");

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();

        let result = await Client.getInstance().request("/login", "POST", {
            username: formData.username,
            password: Encryption.sha256(formData.password),
        });

        if (!result.success) {
            handleAlert(result.message, "error");
            return;
        }

        localStorage.setItem("token", result.token);

        handleAlert(result.message, "success");

        route(RouteOptions.HOME);
    };

    const handleAlert = (message: string, alertColor: AlertColor) => {
        setAlertIsOpen(true);
        setAlertColor(alertColor);
        setAlertMessage(message);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
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
                        <Button type="submit" variant="outlined" size="large">
                            Login
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button onClick={() => route(RouteOptions.REGISTER)} variant="outlined" size="large">
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </form>

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

export default LoginView;
