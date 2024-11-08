import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { Player, ServerMessageType } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import ServerMessageContainer from "./ServerMessageContainer";
import { useNavigate } from "react-router-dom";
import { useSettingsContext } from "../hooks/useSettingsContext";
import PositionSelectionDropdown from "./PositionSelectionDropdown";
import PlayerTeamSelectionDropdown from "./PlayerTeamSelectionDropdown";

export default function FreeAgentsTable() {

    const user = useAuthContext().state.user;
    const {settings} = useSettingsContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [players, setPlayers] = useState<Player[]>([]);

    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");

    const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);
    const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);

    const filteredPlayers = players.filter(player => {
        return player.position.includes(selectedPosition ?? "") && player.team?.includes(selectedTeam ?? "")
    })

    useEffect(() => {
        const QUERY_PARAMS = new URLSearchParams({leagueId: user?.leagueId ?? ""})

        setIsLoading(true);
        setServerMessage("");
        setServerMessageType("info");

        fetch(import.meta.env.VITE_SERVER + "/free-agents?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                response.json()
                .then(retrievedPlayers => {
                    console.log(retrievedPlayers);
                    setIsLoading(false);
                    setPlayers(retrievedPlayers);
                })
            } else {
                response.json()
                .then(responseJson => {
                    console.log(responseJson);
                    setIsLoading(false);
                    setServerMessageType("danger");
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)")
                })
            }
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
            setServerMessageType("danger");
            setServerMessage("An unexpected error occured (see console)");
        })
    }, [user?.leagueId])

    const signFreeAgent = (playerId : string) => {
        setIsLoading(true);
        setServerMessage("");
        setServerMessageType("info");

        const QUERY_PARAMS = new URLSearchParams({playerId: playerId});
        const HEADERS : HeadersInit = {authorization: user?.authToken ?? ""}

        fetch(import.meta.env.VITE_SERVER + "/free-agents/sign?" + QUERY_PARAMS.toString(), {method: "POST", headers: HEADERS})
        .then(response => {
            if (response.ok) {
                response.json()
                .then(responseJson => {
                    setIsLoading(false);
                    setServerMessage(responseJson.message ?? "Success");
                    setServerMessageType("success");
                    alert(responseJson.message ?? "Success")

                    navigate('/my-account');
                })
            } else {
                response.json()
                .then(responseJson => {
                    setIsLoading(false);
                    setServerMessageType("danger");
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                })
                
            }
        })
        .catch(err => {
            setIsLoading(false);
            setServerMessageType("danger");
            setServerMessage("An unexpected error occured (see console)");
            console.error(err);
        })
    }

    return (
        <>
            <ServerMessageContainer message={serverMessage} variant={serverMessageType} />

            {isLoading ? (
                <>
                    <Spinner variant="primary" /> Loading...
                </>
            ) : (
                <>
                    <Container className="p-0">
                        <Row className="mb-3">
                            <Col md={4} lg={2} className="mb-3 mb-md-0">
                                <PositionSelectionDropdown selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition}/>
                            </Col>

                            <Col md={4} lg={2}>
                                <PlayerTeamSelectionDropdown selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}/>
                            </Col>
                        </Row>
                    </Container>
                    

                    
                    <Table striped bordered hover>

                        <thead>
                            <tr>
                                <th>
                                    Player
                                </th>

                                <th>
                                    Team
                                </th>

                                <th>
                                    Position
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
                            {filteredPlayers.map((player, idx) => (
                                <tr key={idx}>
                                    <td>
                                        {player.playerName}
                                    </td>

                                    <td>
                                        {player.team ?? "Unknown"}
                                    </td>

                                    <td>
                                        {player.position}
                                    </td>

                                    <td>
                                        {player.seasonTotalPoints.toFixed(1)}
                                    </td>

                                    <td>
                                        <Button disabled={settings.lineupsLocked} className="fw-bold btn-primary w-100" onClick={() => {signFreeAgent(player._id)}}>Sign</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </>
    )
}