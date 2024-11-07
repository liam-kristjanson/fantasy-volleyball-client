import { useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import useServerMessage from "../../hooks/useServerMessage";
import ServerMessageContainer from "../ServerMessageContainer";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";

export default function ControlPanel() {

    const {user} = useAuthContext().state;
    const settingsState = useSettingsContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {serverMessage, serverMessageType, setServerMessage, setServerMessageType} = useServerMessage();

    function makeRequest(route : string) {
        setIsLoading(true);
        setServerMessage("");
        setServerMessageType("info");

        fetch(import.meta.env.VITE_SERVER + route, {
            method: "POST",
            headers: {
                Authorization: user?.authToken ?? "" 
            }
        })
        .then(response => {
            response.json()
            .then(responseJson => {
                setIsLoading(false);
                console.log(responseJson);
                if (response.ok) {
                    setServerMessage(responseJson.message ?? "Operation completed successfuly");
                    setServerMessageType("success")
                } else {
                    setServerMessage(responseJson.error ?? "An error occured during the operation (check logs)")
                    setServerMessageType("danger")
                }

                settingsState.updateSettings();
            })
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
            setServerMessage("An unexpected error occured (see console)");
            setServerMessageType("danger");
        })
    }

    if (isLoading) {
        return (
            <>
                <Spinner variant="primary"/> Processing Request...
            </>
        )
    }

    return (
        <>
            <ServerMessageContainer variant={serverMessageType} message={serverMessage}/>

            <Row className="border-top p-1 mb-3">
                <Col xs={12}>
                    <h5>Manage Lineups</h5>
                </Col>

                <Col xs={4}>
                    <Button variant="primary" className="w-100" onClick={() => {makeRequest("/admin/lock-lineups")}}>Lock Lineups</Button>
                </Col>

                <Col xs={4}>
                    <Button variant="primary" className="w-100" onClick={() => {makeRequest("/admin/unlock-lineups")}}>Unlock Lineups</Button>
                </Col>
            </Row>

            <Row className="border-top p-1 mb-3">
                <Col xs={12}>
                    <h5>Manage Standings</h5>
                </Col>

                <Col xs={4}>
                    <Button className="btn-primary w-100" onClick={() => {makeRequest("/admin/refresh-standings")}}>Refresh Standings</Button>
                </Col>
            </Row>

            <Row className="border-top p-1 mb-3">
                <Col xs={12}>
                    <h5>Global Managment</h5>
                </Col>

                <Col xs={4}>
                    <Button className="btn-primary w-100" onClick={() => {makeRequest("/admin/start-next-week")}}>Start Next Week</Button>
                </Col>

                {/* <Col xs={4}>
                    <Button className="btn-warning w-100 fw-bold" onClick={() => {makeRequest("/admin/reset-all")}}>Reset to Week 1</Button>
                </Col> */}
            </Row>
        </>
    )
}