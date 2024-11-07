import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import useServerMessage from "../hooks/useServerMessage";
import ServerMessageContainer from "../components/ServerMessageContainer";

export default function ChangePassword() {

    const {user} = useAuthContext().state;
    const {serverMessage, setServerMessage, setServerMessageType, serverMessageType} = useServerMessage();

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isConfirmationInvalid, setIsConfirmationInvalid] = useState<boolean>(false);
    const [isOldPasswordInvalid, setIsOldPasswordInvalid] = useState<boolean>(false);

    function handleSubmit() {
        setServerMessage("");
        setIsConfirmationInvalid(false);
        setIsOldPasswordInvalid(false);
        setIsConfirmationInvalid(false);

        if (!oldPassword) {
            setIsOldPasswordInvalid(true);
            setServerMessageType('warning');
            setServerMessage('Please enter your old password');
            return;
        }

        if (!newPassword || !newPasswordConfirm) {
            setIsConfirmationInvalid(true);
            setServerMessageType('warning');
            setServerMessage("Please enter a new password and confirm your new password");
            return;
        }

        if (newPassword.length < 5) {
            setIsConfirmationInvalid(true);
            setServerMessageType('warning');
            setServerMessage('New password must be at least 6 characters');
            return;
        }

        //validate input
        if (!(newPassword == newPasswordConfirm)) {
            setIsConfirmationInvalid(true);
            setServerMessageType("warning");
            setServerMessage("New password and confirm new password do not match.");
            return;
        }

        //send request to server
        setIsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/account/update-password", {
            method: "POST",
            headers: {
                "Authorization": user?.authToken ?? "",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        })
        .then(response => {
            response.json().then(responseJson => {
                setIsLoading(false);
                console.log("Update password response:", responseJson);
                if (response.ok) {
                    setServerMessageType("success");
                    setServerMessage(responseJson.message ?? "Success");
                } else {
                    setServerMessageType("danger");
                    setServerMessage(responseJson.error ?? "Failed to update password");
                    if (response.status == 401) {
                        setIsOldPasswordInvalid(true);
                    }
                }
            })
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
            setServerMessageType('danger');
            setServerMessage('An unexpected error occured (see console)');
        })

    }

    return (
        <>
            <Navbar />
            
            <Container>
                <Row>
                    <Col>
                        <h1 className="pt-5 text-center">Change Password</h1>
                    </Col>
                </Row>

                <Row className="d-flex justify-content-center">
                    <Col xl={6} md={8}>
                        <Card className="shadow">
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Old Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => {setIsOldPasswordInvalid(false); setOldPassword(e.target.value)}}
                                            disabled={isLoading}
                                            isInvalid={isOldPasswordInvalid}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => {setNewPassword(e.target.value)}}
                                            disabled={isLoading}
                                            isInvalid={isConfirmationInvalid}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={newPasswordConfirm}
                                            onChange={(e) => {setNewPasswordConfirm(e.target.value)}}
                                            disabled={isLoading}
                                            isInvalid={isConfirmationInvalid}
                                        />
                                    </Form.Group>

                                    {serverMessage && <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>}

                                    {isLoading ? (
                                        <>
                                            <Spinner variant="primary"/> Processing Request...
                                        </>
                                    ) : (
                                        <Button className="btn-primary fw-bold w-100 btn-lg" onClick={() => {handleSubmit()}}>Change Password</Button>    
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}