import { FormEvent, useState } from "react";
import "./Register.css";
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

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const [isAlertOpen, setAlertIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState<AlertColor>("error");

    const handleRegister = async (event: FormEvent) => {
        event.preventDefault();

        let result: Response = await Client.register(formData);

        if (!result.body.success) {
            handleAlert(result.body.message, "error");
            return;
        }

        localStorage.setItem("username", formData.username);
        localStorage.setItem("password", formData.password);

        handleAlert(result.body.message, "success");
    };

    const handleAlert = (message: string, alertColor: AlertColor) => {
        setAlertIsOpen(true);
        setAlertColor(alertColor);
        setAlertMessage(message);
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <Grid container direction={"column"} spacing={2}>
                    <Grid item>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </Grid>

                    <Grid item>
                        <TextField
                            label="Username"
                            name="username"
                            onChange={handleChange}
                            value={formData.username}
                        />
                    </Grid>

                    <Grid item>
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </Grid>

                    <Grid item>
                        <Button type="submit" variant="outlined" size="large">
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

export default Register;
