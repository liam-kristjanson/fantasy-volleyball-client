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

    function titleDisplayFormat(gameTitle: string) {
        const inputArray = gameTitle.split("");
        let outputString = ""

        //add a space after uppercase letters 
        for (let i = 0; i<gameTitle.length; i++) {
            if (inputArray[i].toUpperCase() === inputArray[i]) {
                outputString += " " + inputArray[i]
            } else {
                outputString += inputArray[i];
            }
        }

        return outputString;
    }

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
                                            <th className="d-none d-sm-table-cell">
                                                Week
                                            </th>

                                            <th>
                                                Title
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                Kills
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                Errors
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                Attempts
                                            </th>

                                            <th className="d-none d-sm-table-cell">
                                                EFF
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                Assists
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                Aces
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                Digs
                                            </th>

                                            <th className="d-none d-lg-table-cell">
                                                BS
                                            </th>

                                            <th className="d-none d-lg-table-cell">
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
                                                    <td className="d-none d-sm-table-cell">
                                                        {match.weekNum}
                                                    </td>

                                                    <td>
                                                        {titleDisplayFormat(match.gameTitle)}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.kills}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.errors}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.attempts}
                                                    </td>

                                                    <td className="d-none d-sm-table-cell">
                                                        {(match.stats.attempts > 0) ? ((match.stats.kills - match.stats.errors) / match.stats.attempts).toFixed(3) : "0.000"}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.assists}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.aces}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.digs}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
                                                        {match.stats.soloBlocks}
                                                    </td>

                                                    <td className="d-none d-lg-table-cell">
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