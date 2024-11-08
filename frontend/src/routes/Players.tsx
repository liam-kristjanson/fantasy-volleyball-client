import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Player, ServerMessageType } from "../types";
import PlayerRankingsTable from "../components/PlayerRankingsTable";
import ServerMessageContainer from "../components/ServerMessageContainer";
import PositionSelectionDropdown from "../components/PositionSelectionDropdown";
import PlayerTeamSelectionDropdown from "../components/PlayerTeamSelectionDropdown";

export default function Players() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverMessage, setServerMessage] = useState<string>("");
    const [responseType, setResponseType] = useState<ServerMessageType>("info");
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);
    const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);

    const filteredPlayers = players.filter(player => {
        return (player.position.includes(selectedPosition ?? "") && (player.team ?? "").includes(selectedTeam ?? ""));
    })

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
            console.log(responseJson);
            if (responseJson.error) {
                setServerMessage(responseJson.error)
            } else {
                setPlayers(responseJson);
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

                <Row className="mb-3">
                    <Col md={4} lg={2} className="mb-3 mb-md-0">
                        <PositionSelectionDropdown selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition}/>
                    </Col>

                    <Col md={4} lg={2}>
                        <PlayerTeamSelectionDropdown selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <PlayerRankingsTable
                            players={filteredPlayers}
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