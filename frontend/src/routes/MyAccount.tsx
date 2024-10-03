import { Button, Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { LineupDocument, Roster, ServerMessageType } from "../types";
import { useNavigate } from "react-router-dom";
import ServerMessageContainer from "../components/ServerMessageContainer";
import { useSettingsContext } from "../hooks/useSettingsContext";

export default function MyAccount() {

    const { dispatch, state} = useAuthContext();
    const user = state.user;
    const {settings} = useSettingsContext();
    const navigate = useNavigate();

    const [roster, setRoster] = useState<Roster>();
    const [isRosterLoading, setIsRosterLoading] = useState<boolean>(false);

    const [lineup, setLineup] = useState<LineupDocument | undefined>();
    const [isLineupLoading, setIsLineupLoading] = useState<boolean>(false);

    const [lineupMessage, setLineupMessage] = useState<string>("");
    const [lineupMessageType, setLineupMessageType] = useState<ServerMessageType>("info");

    const QUERY_PARAMS = new URLSearchParams({
        leagueId: user?.leagueId ?? "",
        userId: user?.userId ?? ""
    })

    useEffect(() => {

        fetchRoster();
        fetchLineup();

    }, [user])

    function handleLogout() {
        dispatch({type: "LOGOUT", payload: null});
        navigate('/')
    }

    function handleDropPlayer(playerId : string) {
        setIsRosterLoading(true);

        const QUERY_PARAMS = new URLSearchParams({playerId});


        fetch(import.meta.env.VITE_SERVER + "/roster/drop-player?" + QUERY_PARAMS.toString(), {
            headers: {authorization: user?.authToken?? ""},
            method: "POST"
        })
        .then(response => {
            if (response.ok) {
                response.json().then(responseJson => {
                    setIsRosterLoading(false);
                    alert(responseJson.message ?? "Success");
                    fetchRoster();
                })
            } else {
                response.json().then(responseJson => {
                    setIsRosterLoading(false);
                    console.error(responseJson);
                    alert(responseJson.error ?? "An unexpected error occured (see console)");
                })
            }
        })
        .catch(err => {
            setIsRosterLoading(false);
            console.error(err);
            alert("An unexpected error occured (see console)");
        })
    }

    function fetchRoster() {
        setIsRosterLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/roster?" + QUERY_PARAMS.toString())
        .then(response => {
            return response.json()
        })
        .then(responseJson => {
            console.log("ROSTER: ");
            console.log(responseJson);
            setRoster(responseJson);
            setIsRosterLoading(false);
        })
    }

    function fetchLineup() {
        setLineupMessage("");
        setLineupMessageType("info");
        setIsLineupLoading(true);
        
        fetch(import.meta.env.VITE_SERVER + "/lineup?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                response.json().then(responseJson => {
                    console.log("LINEUP: ");
                    console.log(responseJson);
                    setLineup(responseJson)
                    setIsLineupLoading(false);
                })
            } else {
                response.json().then(responseJson => {
                    console.error(responseJson);
                    setLineupMessage(responseJson.error ?? "An unexpected error occured (see console)");
                    setLineupMessageType("danger");
                    setIsLineupLoading(false);
                })
            }
        })
        .catch(err => {
            console.error(err);
            setIsLineupLoading(false);
            setLineupMessageType("danger");
            setLineupMessage(err);
        })

    }

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
                        <ServerMessageContainer message={lineupMessage} variant={lineupMessageType}/>
                        <Card className="shadow mb-5">
                            <Card.Header className="text-primary fw-bold">
                                Active Lineup: Week {settings.currentWeekNum} {settings.lineupsLocked && "(LOCKED IN)"}
                            </Card.Header>

                            <Card.Body>
                                <Table striped bordered hover>

                                    <thead>
                                        <tr>
                                            <th>
                                                Position
                                            </th>

                                            <th>
                                                Name
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {isLineupLoading || !lineup ? (
                                            <tr>
                                                <td colSpan={2}>
                                                    <Spinner variant="primary"/> Lineup loading...
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td className="">S</td>
                                                    <td className="">{lineup?.lineup?.S?.playerName ?? "N/A"}</td>
                                                </tr>

                                                <tr>
                                                    <td className="">OH1</td>
                                                    <td>{lineup?.lineup?.OH1?.playerName ?? "N/A"}</td>
                                                </tr>

                                                <tr>
                                                    <td className="">OH2</td>
                                                    <td>{lineup?.lineup?.OH2?.playerName ?? "N/A"}</td>
                                                </tr>
 
                                                <tr>
                                                    <td className="">OH3</td>
                                                    <td>{lineup?.lineup?.S?.playerName ?? "N/A"}</td>
                                                </tr>

                                                <tr>
                                                    <td className="">M1</td>
                                                    <td>{lineup?.lineup?.M1?.playerName ?? "N/A"}</td>
                                                </tr>

                                                <tr>
                                                    <td className="">M2</td>
                                                    <td>{lineup?.lineup?.M2?.playerName ?? "N/A"}</td>
                                                </tr>

                                                <tr>
                                                    <td className="">L</td>
                                                    <td>{lineup?.lineup?.L?.playerName ?? "N/A"}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </Table>

                                <Button className="btn-primary fw-bold me-2" onClick={() => {navigate('/team-performance')}}>View Performance</Button>
                                <Button disabled={settings.lineupsLocked} className="btn-primary fw-bold" onClick={() => {navigate('/edit-lineup')}}>Edit Lineup</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col>

                        <Card className="shadow mb-4">

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

                                            <th>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {isRosterLoading ? (
                                            <tr>
                                                <td colSpan={4}>
                                                    <Spinner variant="primary"/> Roster loading...
                                                </td>
                                            </tr>
                                        ) : (
                                            Array.isArray(roster?.players) && roster.players.length > 0 ? (
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
    
                                                        <td>
                                                            <Button disabled={settings.lineupsLocked} className="btn-primary fw-bold" onClick={() => {handleDropPlayer(player._id)}}>Drop</Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="fw-bold text-danger" colSpan={4}>Your roster is empty! Start by signing some free agents.</td>
                                                </tr>
                                            )
                                        )}
                                        
                                    </tbody>
                                </Table>

                                <Button className="fw-bold btn-primary" onClick={() => {navigate('/free-agents')}}>Free agents</Button>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Button className="w-100 btn-lg mb-5 fw-bold" variant="primary" onClick={() => {handleLogout()}}>Log Out</Button>
                        {/* <p className="mb-4">Current auth context: {JSON.stringify(user) ?? "Not found"}</p>

                        <p>Current settings context: {JSON.stringify(settings)}</p> */}
                    </Col>
                </Row>
            </Container>
        </>
    )
}