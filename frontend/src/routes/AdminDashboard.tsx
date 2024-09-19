import { useAuthContext } from "../hooks/useAuthContext"

export default function AdminDashboard() {

    const user = useAuthContext().state.user;

    return (
        <>
            <h1>Admin Dashboard</h1>

            <p>
                Current auth context:
                {JSON.stringify(user)}

            </p>
        </>
    )
}