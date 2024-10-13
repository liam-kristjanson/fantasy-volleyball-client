import { Button, Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import ServerMessageContainer from "../components/ServerMessageContainer";
import useServerMessage from "../hooks/useServerMessage";
import { Lineup, Player, Position, User } from "../types";

export default function EditLineup() {

    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const {serverMessage, setServerMessage, serverMessageType, setServerMessageType} = useServerMessage();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lineup, setLineup] = useState<Lineup | undefined>(undefined);
    const [benchPlayers, setBenchPlayers] = useState<Player[] | undefined>(undefined);
    const [swapInPlayers, setSwapInPlayers] = useState<Player[] | undefined>(undefined);
    const [selectedPosition, setSelectedPosition] = useState<Position | undefined>(undefined);

    const getLineup = useCallback((user : User) => {
        setIsLoading(true);
        // setServerMessage("");
        // setServerMessageType("info");

        const QUERY_PARAMS = new URLSearchParams({userId: user.userId, leagueId: user.leagueId});

        fetch(import.meta.env.VITE_SERVER + "/lineup?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                response.json()
                .then(responseJson => {
                    setIsLoading(false);
                    setLineup(responseJson.lineup);
                    console.log("LINEUP", responseJson)
                })
            } else {
                response.json()
                .then(responseJson => {
                    setIsLoading(false);
                    setServerMessageType("danger");
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                    console.error(responseJson);
                })
            }
        })
        .catch(err => {
            setIsLoading(false);
            setServerMessage("An unexpected error occured (see console)");
            console.error(err);  
        })
    }, [setServerMessage, setServerMessageType])

    const getBenchPlayers = useCallback((user: User) => {
        setIsLoading(true);
        // setServerMessage("");
        // setServerMessageType("info");

        const QUERY_PARAMS = new URLSearchParams({userId: user.userId, leagueId: user.leagueId});

        fetch(import.meta.env.VITE_SERVER + "/lineup/bench?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                response.json()
                .then(responseJson => {
                    setIsLoading(false);
                    setBenchPlayers(responseJson);
                    console.log("Bench players ", responseJson)
                })
            } else {
                response.json()
                .then(responseJson => {
                    setServerMessageType("danger");
                    setIsLoading(false);
                    console.error(responseJson);
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)")
                })
            }
        })
        .catch(err => {
            setIsLoading(false);
            setServerMessage("An unexpected error occured (see console)");
            console.error(err);
        })
    }, [setServerMessageType, setServerMessage])

    function selectPosition(selectedPosition: Position) {
        setServerMessage("");
        setServerMessageType('info');
        setSelectedPosition(selectedPosition);

        setSwapInPlayers(benchPlayers?.filter(benchPlayer => {
            return isValidPosition(benchPlayer.position, selectedPosition);
        }));
    }

    function isValidPosition(playerPosition : string, lineupSlot: Position) : boolean {
        switch (lineupSlot) {
            case "S":
                return playerPosition.includes("S");
            case "OH1":
            case "OH2":
            case "OH3":
                return playerPosition.includes("OH");
            case "M1":
            case "M2":
                return playerPosition.includes("M");
            case "L":
                return playerPosition.includes("L");
        }

        return false;
    }

    function requestSwap(position: Position, player: Player) {
        if (user) {
            setIsLoading(true);
            setServerMessage("");
            setServerMessageType("info");

            const QUERY_PARAMS = new URLSearchParams({playerId: player._id, lineupSlot: position});

            fetch(import.meta.env.VITE_SERVER + "/lineup/swap?" + QUERY_PARAMS.toString(), {
                headers: {authorization: user?.authToken ?? ""},
                method: "POST"
            })
            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(responseJson => {
                        setIsLoading(false);
                        setServerMessageType("success")
                        setServerMessage(responseJson.message ?? "Success")
                        console.log(responseJson);

                        //reset selected position and swapIn players
                        setSelectedPosition(undefined);
                        setSwapInPlayers(undefined);

                        //refresh roster and lineup
                        getBenchPlayers(user);
                        getLineup(user);
                    })
                } else {
                    response.json()
                    .then(responseJson => {
                        setIsLoading(false);
                        setServerMessageType("danger");
                        setServerMessage(responseJson.error ?? "An unexpected error occured (see console)")

                        setSelectedPosition(undefined);
                        setSwapInPlayers(undefined);

                        //refresh roster and lineup
                        getBenchPlayers(user);
                        getLineup(user);
                    })
                }
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                setServerMessageType("danger");
                setServerMessage("An unexpected error occured (see console)");

                setSelectedPosition(undefined);
                setSwapInPlayers(undefined);

                //refresh roster and lineup
                getBenchPlayers(user);
                getLineup(user);
            })
        } else {
            navigate("/login");
        }
    }

    function cancelSwap() {
        setSelectedPosition(undefined);
        setSwapInPlayers(undefined);
    }

    useEffect(() => {
        if (user) {
            getLineup(user);
            getBenchPlayers(user);
        } else {
            navigate('/login')
        }
    }, [user, getBenchPlayers, getLineup, navigate]);

    return (
        <>
            <Navbar />

            <Container>
                <Row className="pt-5">
                    <Col>
                        <a className="text-decoration-none hover-pointer text-primary hover-underline mb-3" onClick={() => {navigate('/my-account')}}>{'\u2190'} Back to accout dashboard</a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className="text-center">Edit Lineup</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ServerMessageContainer message={serverMessage} variant={serverMessageType} />
                    </Col>
                </Row>

                {!selectedPosition && 
                    <Row>
                        <Col>
                            <Card className="shadow">
                                <Card.Header className="text-primary">
                                    Current Lineup
                                </Card.Header>

                                <Card.Body>
                                    {isLoading ? (
                                        <>
                                            <Spinner variant="primary"/> Loading...
                                        </>
                                    ) : (
                                        lineup ? (
                                            <>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Position
                                                            </th>

                                                            <th>
                                                                Player
                                                            </th>

                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle">
                                                                S
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.S?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("S")}} className="btn-primary fw-bold">Swap</Button>    
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className="align-middle">
                                                                OH1
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.OH1?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("OH1")}} className="btn-primary fw-bold">Swap</Button>
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className="align-middle">
                                                                OH2
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.OH2?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("OH2")}}className="btn-primary fw-bold">Swap</Button>
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className="align-middle">
                                                                OH3
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.OH3?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("OH3")}} className="btn-primary fw-bold">Swap</Button>
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className="align-middle">
                                                                M1
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.M1?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("M1")}} className="btn-primary fw-bold">Swap</Button>
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className="align-middle">
                                                                M2
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.M2?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("M2")}} className="btn-primary fw-bold">Swap</Button>
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className="align-middle">
                                                                L
                                                            </td>

                                                            <td>
                                                                <div className="d-flex flex-row justify-content-between align-items-center pe-3">
                                                                    {lineup.L?.playerName ?? "N/A"}
                                                                    <Button onClick={() => {selectPosition("L")}} className="btn-primary fw-bold">Swap</Button>
                                                                </div>
                                                                
                                                            </td>
                                                        </tr>


                                                    </tbody>
                                                </Table>
                                            </>
                                        ) : (
                                            <>
                                                Failed to load lineup!
                                            </>
                                        )
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                }

                <Row>
                    <Col>
                        {selectedPosition && (
                            <Card className="shadow">
                                <Card.Header className="text-primary fw-bold">
                                    Choose player to swap into position {selectedPosition}
                                </Card.Header>

                                <Card.Body>
                                    {isLoading ? (
                                        <>
                                            <Spinner variant="primary" /> Loading...
                                        </>
                                    ) : 
                                        Array.isArray(swapInPlayers) && swapInPlayers.length > 0 ? (
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Player
                                                        </th>

                                                        <th>
                                                            Position(s)
                                                        </th>

                                                        <th>
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {swapInPlayers.map((player, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                {player.playerName}
                                                            </td>

                                                            <td>
                                                                {player.position}
                                                            </td>

                                                            <td>
                                                                <Button className="w-100 fw-bold" variant="primary" onClick={() => {requestSwap(selectedPosition, player)}}>Swap</Button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    <tr>
                                                        <td colSpan={3}>
                                                            <Button className="btn-warning btn-lg fw-bold" onClick={() => {cancelSwap()}}>Cancel</Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <div className="d-flex flex-row justify-content-between align-items-center">
                                                <div className="fw-bold">No eligible players found!</div>
                                                <Button className="btn-warning btn-lg fw-bold" onClick={() => {cancelSwap()}}>Cancel</Button>
                                            </div>
                                        )}

                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}