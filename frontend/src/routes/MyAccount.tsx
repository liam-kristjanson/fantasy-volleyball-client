import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { Roster } from "../types";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {

    const { user } = useAuthContext().state;
    const navigate = useNavigate();

    const [roster, setRoster] = useState<Roster>();
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        setIsLoading(true);
        const QUERY_PARAMS = new URLSearchParams({
            leagueId: user?.leagueId ?? "",
            userId: user?.userId ?? ""
        })

        fetch(import.meta.env.VITE_SERVER + "/roster?" + QUERY_PARAMS.toString())
        .then(response => {
            return response.json()
        })
        .then(responseJson => {
            console.log("ROSTER: ");
            console.log(responseJson);
            setRoster(responseJson);
            setIsLoading(false);
        })
    }, [user])

    return (
        <>
            <Navbar/>

            <Container>
                <Row>
                    <Col>
                        <h1 className="text-center pt-5 mb-3">My Account</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>

                        <Card className="shadow">

                            <Card.Header className="text-primary fw-bold">
                                My Roster
                            </Card.Header>

                            <Card.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Position
                                            </th>

                                            <th>
                                                Total Points
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={3}>
                                                    <Spinner variant="primary"/> Roster loading...
                                                </td>
                                            </tr>
                                        ) : (
                                            roster?.players.map(player => (
                                                <tr>
                                                    <td>
                                                    <a onClick={() => navigate("/player-info", {state: {player: player}})} className="text-black text-decoration-underline hover-pointer">
                                                        {player.playerName}
                                                    </a>
                                                    </td>
    
                                                    <td>
                                                        {player.position}
                                                    </td>
    
                                                    <td>
                                                        {player.prevSeasonPoints}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>


                        <p>Current auth context: {JSON.stringify(user) ?? "Not found"}</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}