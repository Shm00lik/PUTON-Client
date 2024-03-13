import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { RouteOptions, route } from "../App";
import { Client, Response } from "../utils/Protocol";

const Appbar = () => {

    const logout = async () => {
        let result: Response = await Client.logout();

        if (result.body.success) {

            route(RouteOptions.LOGIN);
        }
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Button onClick={() => route(RouteOptions.HOME)}>
                    <Box component="img" src="./logo.svg" sx={{ minHeight: "25px" }} />
                </Button>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

                <Button color="inherit" onClick={logout}>Logout</Button>

            </Toolbar>
        </AppBar>
    )
}

export default Appbar