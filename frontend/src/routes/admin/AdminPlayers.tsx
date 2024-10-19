import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useEffect, useState } from "react";
import { Player } from "../../types";
import useServerMessage from "../../hooks/useServerMessage";
import ServerMessageContainer from "../../components/ServerMessageContainer";
import { useNavigate } from "react-router-dom";

export default function AdminPlayers() {

    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {serverMessage, serverMessageType, setServerMessage, setServerMessageType} = useServerMessage();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/players")
        .then(response => {
            response.json()
            .then(responseJson => {
                console.log("Players response", responseJson);

                if (response.ok) {
                    setPlayers(responseJson);
                } else {
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)")
                    setServerMessageType('danger');
                }
                setIsLoading(false);
            })
        })
    }, [])
    return (
        <>
            <AdminNavbar/>

            <Container>
                <Row className="pt-5">
                    <Col>
                        <h1>Manage Players</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {
                            isLoading ? (
                                <>
                                    <Spinner variant="primary"/>Loading players...
                                </>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                Player
                                            </th>

                                            <th>
                                                Active?
                                            </th>

                                            <th>
                                                Position
                                            </th>

                                            <th>
                                                Team
                                            </th>

                                            <th>
                                                Total Points
                                            </th>

                                            <th>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {players.map((player, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    {player.playerName}
                                                </td>

                                                <td>
                                                    {player.isActive ? (
                                                        <div className="text-success fw-bold">
                                                            Yes
                                                        </div>
                                                    ) : (
                                                        <div className="text-danger fw-bold">
                                                            No
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {player.position}
                                                </td>

                                                <td>
                                                    {player.team ?? "Unknown"}
                                                </td>

                                                <td>
                                                    {player.seasonTotalPoints.toFixed(1)}
                                                </td>

                                                <td>
                                                    <Button onClick={() => {navigate('/admin/manage-player', {state: {player}})}}>Manage</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )
                        }
                        
                    </Col>
                </Row>
            </Container>
        </>
    )
}