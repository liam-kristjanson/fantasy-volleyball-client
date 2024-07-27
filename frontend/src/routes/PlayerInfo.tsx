import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Match, PlayerRanking, ServerMessageType } from "../types";
import ServerMessageContainer from "../components/ServerMessageContainer";

export default function PlayerInfo() {

    const { state } = useLocation();
    const [selectedPlayer] = useState<PlayerRanking>(state.player);
    const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");
    const [serverMessage, setServerMessage] = useState<string>("");

    useEffect(() => {
        setIsLoading(true);
        setServerMessage("");
        fetch(import.meta.env.VITE_SERVER + "/player-matches?id=" + selectedPlayer._id)
        .then(response => {
            return response.json();
        })
        .then(responseJson => {
            console.log(responseJson);
            setPlayerMatches(responseJson);
            setIsLoading(false);
        })
        .catch(err => {
            setIsLoading(false);
            setServerMessageType('danger'); 
            setServerMessage("An unexpected error occured: " + err);
        })
    }, [selectedPlayer])

    return (
        <>
            <Navbar/>
            
            <Container className="pt-5">
                <Row>
                    <Col>
                        <h1>Player Info: {state.player?.playerName ?? "Unknown"}</h1>
                        <hr/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p>Position: {selectedPlayer.position ?? "Unknown"} Previous Season Points: {selectedPlayer.prevSeasonPoints ?? "Unknown"}</p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card>
                            <Card.Header className="text-primary">
                                Matches
                            </Card.Header>

                            <Card.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                Week
                                            </th>

                                            <th>
                                                Title
                                            </th>

                                            <th>
                                                Season
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={3}>
                                                    <Spinner variant="primary"/>
                                                    Player matches loading...
                                                </td>
                                            </tr>
                                        ) : (
                                            playerMatches.map(match => (
                                                <tr>
                                                    <td>
                                                        {match.weekNum}
                                                    </td>

                                                    <td>
                                                        {match.gameTitle}
                                                    </td>

                                                    <td>
                                                        {match.season}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}