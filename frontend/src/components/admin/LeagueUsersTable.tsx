import { useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { User } from "../../types";
import ServerMessageContainer from "../ServerMessageContainer";
import useServerMessage from "../../hooks/useServerMessage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

interface LeagueUsersTableProps {
    leagueId: string;
}

export default function LeagueUsersTable({leagueId} : LeagueUsersTableProps) {

    const {user} = useAuthContext().state;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);

    const {serverMessage, setServerMessage, setServerMessageType, serverMessageType} = useServerMessage();

    useEffect(() => {
        setIsLoading(true);
        const QUERY = new URLSearchParams({leagueId});

        fetch(import.meta.env.VITE_SERVER + "/admin/users?" + QUERY.toString(),
        {headers: {Authorization: user?.authToken ?? ""}})
        .then(response => {
            setIsLoading(false);
            response.json().then(responseJson => {
                if (response.ok) {
                    console.log("Users fetched successfuly:", responseJson);
                    setUsers(responseJson);
                } else {
                    console.error(responseJson);
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                    setServerMessageType("danger");
                }
            })
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
            setServerMessage("An unexpected error occured (see console)");
            setServerMessageType('danger');
        })
    }, [])

    if (isLoading) return (
        <>
            <Spinner variant="primary"/> League users loading...
        </>
    )

    return (
        <>  
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            Username
                        </th>

                        <th>
                            UserId
                        </th>

                        <th>
                            Role
                        </th>

                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user, idx) => (
                        <tr key={idx}>
                            <td>
                                {user.username}
                            </td>

                            <td>
                                {user._id}
                            </td>

                            <td>
                                {user.role}
                            </td>

                            <td>
                                <Button variant="primary" onClick={() => {navigate("/admin/manage-user", {state: {selectedUser: user}})}}>Manage</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ServerMessageContainer variant={serverMessageType} message={serverMessage}/>
        </>
        
    )
}