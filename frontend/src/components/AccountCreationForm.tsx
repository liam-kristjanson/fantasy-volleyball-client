import { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import useServerMessage from "../hooks/useServerMessage";
import ServerMessageContainer from "./ServerMessageContainer";
import { useNavigate } from "react-router-dom";

export default function AccountCreationForm() {

    const navigate = useNavigate();

    const [leagueId, setLeagueId] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {serverMessage, serverMessageType, setServerMessage, setServerMessageType} = useServerMessage();

    function handleSubmit() {
        //reset messages
        setServerMessage("");
        setServerMessageType("info");

        //validate leagueId
        if (!leagueId) {
            setServerMessageType('warning');
            setServerMessage("Please enter a league ID");
            return;
        }

        //validate username
        if (username.length < 6 || username.length > 30) {
            setServerMessageType("warning");
            setServerMessage("Username must be between 6 and 30 characters")
            return;
        }

        //validate password
        if (password.length < 6 || password.length > 30) {
            setServerMessageType("warning");
            setServerMessage("Password must be between 6 and 30 characters");
            return;
        }

        if (!(password === confirmPassword)) {
            setServerMessageType("warning");
            setServerMessage("Password and confirm password do not match");
            return;
        }

        //once passing frontend validation, send the post request to the server.
        setIsLoading(true);
        fetch(import.meta.env.VITE_SERVER + "/account/create", {
            headers: {"content-type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
                leagueId: leagueId
            })
        })
        .then(response => {
            if (response.ok) {
                response.json().then(responseJson => {
                    setIsLoading(false);
                    console.log(responseJson);
                    alert(responseJson.message ?? "Your account was created successfuly. You may now log in");
                    navigate('/login');
                })
            } else {
                response.json().then(responseJson => {
                    setIsLoading(false);
                    console.error(responseJson);
                    setServerMessageType('danger');
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                })
            }
        })
        .catch(err => {
            setIsLoading(false);
            console.error(err);
            setServerMessageType('danger');
            setServerMessage("An unexpected error occured (see console)");
        })
    }

    return (
        <>
            <Card className="shadow">
                <Card.Header>
                    Create Account
                </Card.Header>

                <Card.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>League ID:</Form.Label>
                            <Form.Control type="text" name="leagueId" value={leagueId} onChange={e => {setLeagueId(e.target.value)}}/>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control type="text" name="username" value={username} onChange={e => {setUsername(e.target.value)}}></Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" name="password" value={password} onChange={e => {setPassword(e.target.value)}}></Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control type="password" name="confirm-password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}}></Form.Control>
                        </Form.Group>

                        {isLoading ? (
                            <>
                                <Spinner variant="primary"/> Loading...
                            </>
                            ) : (
                                <Button onClick={() => {handleSubmit()}}className="btn-lg fw-bold">Create Account</Button>
                            )}
                        
                        <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}