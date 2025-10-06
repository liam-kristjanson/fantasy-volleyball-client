import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../types";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import ServerMessageContainer from "../../components/ServerMessageContainer";
import useServerMessage from "../../hooks/useServerMessage";
import { useState } from "react";


export default function ManageUser() {

    const locationState = useLocation().state;
    const selectedUser : User = locationState.selectedUser;

    const {user} = useAuthContext().state;
    const {serverMessage, setServerMessage, serverMessageType, setServerMessageType} = useServerMessage();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [leagueId, setLeagueId] = useState<string>(selectedUser.leagueId);

    function handleDeleteAccount() {
        const deleteConfirmed = confirm("Are you sure you want to delete the account for user " + selectedUser.username + "?");
        setServerMessage("");

        if (deleteConfirmed) {
            setIsLoading(true);
            const QUERY = new URLSearchParams({
                id: selectedUser._id ?? ""
            });

            fetch(import.meta.env.VITE_SERVER + "/admin/user?" + QUERY.toString(), {
                method: "DELETE",
                headers: {
                    authorization: user?.authToken ?? ""
                }
            })
            .then(response => {
                response.json().then(responseJson => {
                    setIsLoading(false);

                    if (response.ok) {
                        alert(responseJson.message ?? "Success")
                        navigate('/admin/dashboard');
                    } else {
                        setServerMessage(responseJson.error ?? "");
                        setServerMessageType("danger");
                    }
                })
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                setServerMessage("An undexpected error occured (see console)");
            })
        }
    }

    function handleUpdateLeagueId() {

        setIsLoading(true);
        const QUERY_PARAMS = new URLSearchParams({userId: selectedUser._id ?? "", leagueId: leagueId});

        fetch(import.meta.env.VITE_SERVER + "/admin/user/leagueid?" +QUERY_PARAMS.toString(), {
            method: "POST",
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                setIsLoading(false);

                if (response.ok) {
                    alert(responseJson.message ?? "Success");
                    navigate('/admin/dashboard')
                } else {
                    setServerMessageType('danger');
                    setServerMessage(responseJson.error ?? "An unexpected error occured while updating leagueId");
                    console.error(responseJson);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
            setServerMessage("An unexpected error occured while updating leagueID (see console)");
        })
    }

    return (
        <>
            <AdminNavbar />

            <Container>
                <Row className="pt-5 mb-5">
                    <Col>
                        <h1>Manage User: {selectedUser.username}</h1>
                    </Col>
                </Row>

                <Row>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>League ID:</Form.Label>
                            <Form.Control value={leagueId} type="text" onChange={(e) => {setLeagueId(e.target.value)}}/>
                        </Form.Group>

                        <Button className="mb-3" variant="primary" disabled={isLoading} onClick={() => handleUpdateLeagueId()}>Update</Button>
                    </Form>
                </Row>

                
                <Row>
                    <Col md={4}>

                        {isLoading ? (
                            <>
                                <Spinner variant="primary"/> Processing Request...
                            </>
                        ) : (
                            <Button className="w-100 btn-warning fw-bold" onClick={() => {handleDeleteAccount()}}>Delecte Account</Button> 
                        )}
                        
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}