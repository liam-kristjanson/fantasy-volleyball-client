import { Col, Container, Row, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import useServerMessage from "../hooks/useServerMessage";
import ServerMessageContainer from "../components/ServerMessageContainer";
import StandingsTable from "../components/StandingsTable";
import { StandingsEntry } from "../types";

export default function Standings() {

    const {user} = useAuthContext().state;
    const navigate = useNavigate();
    const {serverMessage, serverMessageType, setServerMessage, setServerMessageType} = useServerMessage();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [standings, setStandings] = useState<StandingsEntry[]>([]);

    useEffect(() => {
        setIsLoading(true);

        if (user) {
            const QUERY_PARAMS = new URLSearchParams({
                leagueId: user.leagueId
            })

            fetch(import.meta.env.VITE_SERVER + "/standings?" + QUERY_PARAMS.toString())
            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(responseJson => {
                        setIsLoading(false);
                        console.log(responseJson);
                        setStandings(responseJson);
                    })
                } else {
                    response.json()
                    .then(responseJson => {
                        console.error(responseJson);
                        setServerMessageType('danger');
                        setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                    })
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                setServerMessage("An unexpected error occured (see console)");
                setServerMessageType('danger');
            })
        } else {
            navigate("/login")
        }
    }, [navigate, setServerMessage, setServerMessageType, user])

    return (
        <>
            <Navbar />

            <Container>
                <Row>
                    <Col className="pt-4">
                        <Link className="text-primary" to="/my-account">{'\u2190'} Back to account dashboard</Link>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                        <h1>Standings</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {isLoading ? (
                            <>
                                <Spinner variant="primary"/> Standings Loading...
                            </>
                        ) : (
                            <StandingsTable standings={standings}/>
                        )}

                        <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}