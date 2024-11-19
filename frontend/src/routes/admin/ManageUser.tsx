import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../types";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
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