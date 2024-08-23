import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlayerMatch, PlayerRanking, ServerMessageType } from "../types";
import ServerMessageContainer from "../components/ServerMessageContainer";

export default function PlayerInfo() {

    //TODO: Fix this table for mobile layout

    const { state } = useLocation();
    const [selectedPlayer] = useState<PlayerRanking>(state.player);
    const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
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
                                                Kills
                                            </th>

                                            <th>
                                                Errors
                                            </th>

                                            <th>
                                                Attempts
                                            </th>

                                            <th>
                                                EFF
                                            </th>

                                            <th>
                                                Assists
                                            </th>

                                            <th>
                                                Aces
                                            </th>

                                            <th>
                                                Digs
                                            </th>

                                            <th>
                                                BS
                                            </th>

                                            <th>
                                                BA
                                            </th>

                                            <th>
                                                PTS
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={12}>
                                                    Player matches loading...
                                                    <Spinner variant="primary"/>
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
                                                        {match.stats.kills}
                                                    </td>

                                                    <td>
                                                        {match.stats.errors}
                                                    </td>

                                                    <td>
                                                        {match.stats.attempts}
                                                    </td>

                                                    <td>
                                                        {(match.stats.attempts > 0) ? ((match.stats.kills - match.stats.errors) / match.stats.attempts).toFixed(3) : "0.000"}
                                                    </td>

                                                    <td>
                                                        {match.stats.assists}
                                                    </td>

                                                    <td>
                                                        {match.stats.aces}
                                                    </td>

                                                    <td>
                                                        {match.stats.digs}
                                                    </td>

                                                    <td>
                                                        {match.stats.soloBlocks}
                                                    </td>

                                                    <td>
                                                        {match.stats.blockAssists}
                                                    </td>

                                                    <td className="fw-bold">
                                                        {match.stats.fantasyPoints?.toFixed(1) ?? "N/A"}
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