import { useState } from "react";
import "./Login.css";
import { Button, Grid, TextField } from "@mui/material";
import { Client } from "../utils/Client";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        let result = await Client.login(username, password);

        setUsername(String(result));
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
        </div>
    );
};

export default Login;
