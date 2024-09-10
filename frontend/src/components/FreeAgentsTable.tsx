import { useEffect, useState } from "react";
import { Button, Card, Spinner, Table } from "react-bootstrap";
import { Player, ServerMessageType } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import ServerMessageContainer from "./ServerMessageContainer";
import { useNavigate } from "react-router-dom";

export default function FreeAgentsTable() {

    const user = useAuthContext().state.user;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [players, setPlayers] = useState<Player[]>([]);

    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");

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
    }, [])

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
                setIsLoading(false);
                setServerMessageType("danger");
                setServerMessage("An unexpected error occured (see console)");

                response.json().then(responseJson => {console.log(responseJson)})
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

            <Card>
                <Card.Header className="text-primary">
                    Available players
                </Card.Header>

                <Card.Body>
                    {isLoading ? (
                        <>
                            <Spinner variant="primary" /> Loading...
                        </>
                    ) : (
                        <Table striped bordered hover>

                            <thead>
                                <tr>
                                    <th>
                                        Player
                                    </th>

                                    <th>
                                        Position
                                    </th>

                                    <th>
                                        Points (prev. season)
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
                                            {player.position}
                                        </td>

                                        <td>
                                            {player.prevSeasonPoints}
                                        </td>

                                        <td>
                                            <Button className="fw-bold btn-primary" onClick={() => {signFreeAgent(player._id)}}>Sign</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>    
            </Card> 
        </>
    )
}