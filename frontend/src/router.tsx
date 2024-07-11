import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Players from "./routes/Players";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/players",
        element: <Players />
    }
])