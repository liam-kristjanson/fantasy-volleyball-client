import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Players from "./routes/Players";
import PlayerInfo from "./routes/PlayerInfo";
import Login from "./routes/Login";
import MyAccount from "./routes/MyAccount";
import TeamPerformance from "./routes/TeamPerformance";
import ProtectedRoute from "./components/ProtectedRoute";
import FreeAgents from "./routes/FreeAgents";
import EditLineup from "./routes/EditLineup";
import Matchups from "./routes/Matchups";
import AdminDashboard from "./routes/AdminDashboard";

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
    },
    {
        path:"/my-account",
        element: <ProtectedRoute validRoles={['user',]}> <MyAccount /> </ProtectedRoute>
    },
    {
        path:"/team-performance",
        element: <ProtectedRoute validRoles={['user', 'admin']}> <TeamPerformance /> </ProtectedRoute>
    },
    {
        path:"/free-agents",
        element: <ProtectedRoute validRoles={['user', 'admin']}> <FreeAgents /> </ProtectedRoute>
    }, 
    {
        path:"/edit-lineup",
        element: <ProtectedRoute validRoles={['user', 'admin']}> <EditLineup/> </ProtectedRoute>
    },
    {
        path:"/matchups",
        element: <ProtectedRoute validRoles={['user', 'admin']}> <Matchups /> </ProtectedRoute>
    },
    {
        path:"/admin/dashboard",
        element: <ProtectedRoute validRoles={['admin']}> <AdminDashboard /> </ProtectedRoute>
    }
])