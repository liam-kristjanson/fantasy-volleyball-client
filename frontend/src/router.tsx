import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Players from "./routes/Players";
import PlayerInfo from "./routes/PlayerInfo";
import Login from "./routes/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/players",
        element: <Players />
    },
    {
        path: "/player-info",
        element: <PlayerInfo />
    },
    {
        path: "/login",
        element: <Login />
    }
])