import { useState } from "react";
import "./Login.css";
import {
    Alert,
    AlertColor,
    Button,
    Collapse,
    Grid,
    IconButton,
    Snackbar,
    TextField,
} from "@mui/material";
import { Client, Response } from "../../utils/Protocol";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isAlertOpen, setAlertIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState<AlertColor>("error");

    const handleLogin = async () => {
        let result: Response = await Client.login(username, password);

        if (!result.body.success) {
            handleAlert(result.body.message, "error");
            return;
        }

        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        handleAlert(result.body.message, "success");

        window.location.href = "/"
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
                        onChange={(newName) =>
                            setUsername(newName.target.value)
                        }
                        value={username}
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Password"
                        type="password"
                        onChange={(newPassword) =>
                            setPassword(newPassword.target.value)
                        }
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
