import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { PlayerRanking, ServerMessageType } from "../types";
import PlayerRankingsTable from "../components/PlayerRankingsTable";
import ServerMessageContainer from "../components/ServerMessageContainer";

export default function Players() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverMessage, setServerMessage] = useState<string>("");
    const [responseType, setResponseType] = useState<ServerMessageType>("info");
    const [playerRankings, setPlayerRankings] = useState<PlayerRanking[]>([]);

    //load player rankings from server
    useEffect(() => {
        setIsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/players")
        .then(response => {
            if (response.ok) {
                setResponseType('success');
            } else {
                setResponseType('danger');
            }
            return response.json();
        })
        .then(responseJson => {
            setIsLoading(false);
            if (responseJson.error) {
                setServerMessage(responseJson.error)
            } else {
                setPlayerRankings(responseJson);
            }
        })
        .catch(error => {
            console.error(error);
            setResponseType("danger");
            setServerMessage("An unexpected error occured while fetching player rankings (see console)")
        })
    }, [])

    return (
        <>
            <Navbar />

            <Container className="pt-5">
                <Row>
                    <Col>
                        <h1>Players</h1>
                        <hr/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <PlayerRankingsTable
                            playerRankings={playerRankings}
                            isLoading={isLoading}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ServerMessageContainer
                            message={serverMessage}
                            variant={responseType}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}