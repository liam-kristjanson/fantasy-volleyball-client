import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useState } from "react";
import ServerMessageContainer from "../../components/ServerMessageContainer";
import useServerMessage from "../../hooks/useServerMessage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateLeague() {

    const {user} = useAuthContext().state;
    const navigate = useNavigate();
    const [leagueName, setLeagueName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {serverMessage, serverMessageType, setServerMessage, setServerMessageType} = useServerMessage();

    function createLeague() {
        setIsLoading(true);
        setServerMessage("");
        setServerMessageType('info');

        const leagueDocument = {
            name: leagueName
        }

        fetch(import.meta.env.VITE_SERVER + "/admin/create-league", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": user?.authToken ?? ""
            },
            body: JSON.stringify(leagueDocument)
        })
        .then(response => {
            response.json()
            .then(responseJson => {
                if (response.ok) {
                    alert(responseJson.message ?? "Success")
                    navigate("/admin/dashboard")
                } else {
                    console.error(responseJson);
                    setServerMessageType('danger')
                    setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                }
            })
        })
        .catch(err => {
            console.error(err);
            setServerMessage("An unexpected error occured (see console)");
            setServerMessageType('danger');
        })
    }

    return (
        <>
            <AdminNavbar/>

            <Container>
                <Row className="d-flex justify-content-center">
                    <Col>
                        <h1 className="pt-5 text-center">Create League</h1>
                    </Col>
                </Row>

                <Form>
                    <Row className="mb-3 d-flex justify-content-center">
                        <Form.Group className="col-6">
                            <Form.Label>League Name</Form.Label>
                            <Form.Control disabled={isLoading} type="text" onChange={e => {setLeagueName(e.target.value)}}></Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="d-flex justify-content-center">
                        {isLoading ? (
                            <>
                                <Spinner variant="primary"/>Processing request...
                            </>
                        ) : (
                            <Form.Group className="col-6">
                                <Button className="btn-primary w-100" onClick={() => {createLeague()}}>Create League</Button>
                            </Form.Group>
                        )}
                        
                    </Row>

                    <Row className="d-flex justify-content-center">
                        <Col>
                            <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                        </Col>
                    </Row>
                </Form>
                    
                
            </Container>
        </>
    )
}