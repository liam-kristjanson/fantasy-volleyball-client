import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Player } from "../types";
import PlayerMatchesTable from "../components/PlayerMatchesTable";

export default function PlayerInfo() {

    //TODO: Fix this table for mobile layout

    const { state } = useLocation();
    const [selectedPlayer] = useState<Player>(state.player);

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
                        <PlayerMatchesTable player={selectedPlayer}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}