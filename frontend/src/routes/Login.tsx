import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useState } from "react";
import ServerMessageContainer from "../components/ServerMessageContainer";
import { ServerMessageType } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const {dispatch} = useAuthContext();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverMessage, setServerMessage] = useState<string>('');
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>('info');

    function handleLogin() {
        setIsLoading(true);
        setServerMessage("");
        setServerMessageType("info");
        
        const requestBody = JSON.stringify({
            username: username,
            password: password
        });

        fetch(import.meta.env.VITE_SERVER + "/login", {
            method: "POST",
            body: requestBody,
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                setServerMessageType("success")
            } else {
                setServerMessageType("danger");
            }

            return response.json();
        })
        .then(responseJson => {
            setIsLoading(false);
            setServerMessage(responseJson.error ?? responseJson.message ?? "");
            if (responseJson.user) {
                dispatch({type: "LOGIN", payload: responseJson.user});
                navigate('/my-account');
            }
        })
    }

    return (
        <>
            <Navbar/>

            <Container>
                <Row className="pt-4">
                    <Col>
                        <h1 className="text-center mb-3">Login</h1>
                    </Col>
                </Row>

                <Row className="d-flex justify-content-center">
                    <Col xl={6} md={8}>
                        <Card className="shadow">
                            <Card.Body>
                                <Form>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            name="username"
                                            value={username}
                                            onChange={(e) => {setUsername(e.target.value)}}
                                        />  
                                    </Form.Group> 

                                    <Form.Group className='mb-3'>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => {setPassword(e.target.value)}}
                                        />
                                    </Form.Group>
                                    
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        <Button className="w-100 btn-primary btn-lg fw-bold" onClick={() => {handleLogin()}}>Log in</Button>
                                    )}
                                    
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="d-flex align-items-center">
                    <Col>
                        <ServerMessageContainer
                            variant={serverMessageType}
                            message={serverMessage}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}