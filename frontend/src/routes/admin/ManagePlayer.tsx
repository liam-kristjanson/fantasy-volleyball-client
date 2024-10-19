import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useLocation } from "react-router-dom";
import { Player } from "../../types";
import { useState } from "react";
import ServerMessageContainer from "../../components/ServerMessageContainer";
import useServerMessage from "../../hooks/useServerMessage";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ManagePlayer() {
    const player : Player = useLocation().state.player;
    const {user} = useAuthContext().state;

    //player information
    const [playerName, setPlayerName] = useState<string>(player.playerName ?? "");
    const [team, setTeam] = useState<string>(player.team?? "");
    const [position, setPosition] = useState<string>(player.position ?? "");
    const [isActive, setIsActive] = useState<boolean>(player.isActive ?? true);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {serverMessage, setServerMessage ,setServerMessageType ,serverMessageType} = useServerMessage();

    function handleSaveChanges() {
        setIsLoading(true);
        setServerMessageType('info');
        setServerMessage('');

        const updateObj = {
            playerName,
            team,
            position,
            isActive
        }

        console.log("Saving player changes");
        console.log(updateObj);

        const QUERY = new URLSearchParams({id: player._id.toString()})

        fetch(import.meta.env.VITE_SERVER + "/admin/update-player?" + QUERY.toString(), {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": user?.authToken ?? ""
            },
            body: JSON.stringify(updateObj)
        })
        .then(response => {
            response.json().then(responseJson => {
                setIsLoading(false);
                console.log("Player update response: ", responseJson)
                if (response.ok) {
                    setServerMessageType('success');
                    setServerMessage(responseJson.message ?? "Success");
                } else {
                    setServerMessageType('warning');
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)")
                }
            })
        })
        .catch(err => {
            setIsLoading(false);
            console.error(err);
            setServerMessageType('warning');
            setServerMessage('An unexpected error occured (see console)');
        })
    }

    return (
        <>
            <AdminNavbar/>

            <Container>
                <Row className="pt-5">
                    <Col>
                        <h1>Manage Player: {player.playerName}</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className="shadow">
                            <Card.Header>
                                Player Details
                            </Card.Header>

                            <Card.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Player Name</Form.Label>

                                        <Form.Control type="text" disabled={isLoading} value={playerName} onChange={(e) => {setPlayerName(e.target.value)}}></Form.Control>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>
                                            Team    
                                        </Form.Label>

                                        <Form.Control type="text" disabled={isLoading} value={team} onChange={e => {setTeam(e.target.value)}}/>    
                                    </Form.Group>                  

                                    <Form.Group>
                                        <Form.Label>
                                            Position (s)    
                                        </Form.Label>   

                                        <Form.Control type="text" disabled={isLoading} value={position} onChange={e => {setPosition(e.target.value)}}/> 
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>
                                            Is Active?    
                                        </Form.Label>    

                                        <Form.Check checked={isActive} disabled={isLoading} onChange={e => {setIsActive(e.target.checked)}}/>
                                    </Form.Group>                  
                                </Form>
                            </Card.Body>

                            <Card.Footer>
                                {isLoading ? (
                                    <>
                                        <Spinner variant="primary"/>Loading...
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => {handleSaveChanges()}}className="btn-primary fw-bold">Save Changes</Button>
                                        {serverMessage && <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>}
                                    </>
                                )}
                                
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}