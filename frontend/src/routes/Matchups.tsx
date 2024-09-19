import { Col, Container, Row, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import ServerMessageContainer from "../components/ServerMessageContainer";
import useServerMessage from "../hooks/useServerMessage";
import {MatchupsObject } from "../types";
import MatchupScoreTable from "../components/MatchupScoreTable";
import { useSettingsContext } from "../hooks/useSettingsContext";

export default function Matchups() {
    
    const {user} = useAuthContext().state;
    const {settings} = useSettingsContext();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {serverMessage, setServerMessage, serverMessageType, setServerMessageType} = useServerMessage();


    const [weekNum, setWeekNum] = useState<number>(settings.currentWeekNum);
    const [matchups, setMatchups] = useState<MatchupsObject | undefined>(undefined);
    

    //Fetch matchup data
    useEffect(() => {
        if (user) {
            setIsLoading(true);
            setServerMessage("");
            setServerMessageType("info");

            const QUERY_PARAMS = new URLSearchParams({
                leagueId: user.leagueId,
                weekNum: weekNum.toString()
            })

            fetch(import.meta.env.VITE_SERVER + "/matchup/scores?" + QUERY_PARAMS.toString())
            .then(response => {
                if (response.ok) {
                    response.json().then(responseJson => {
                        setIsLoading(false);
                        console.log("Matchups object:", responseJson);
                        setMatchups(responseJson);
                    })
                } else {
                    response.json().then(responseJson => {
                        setIsLoading(false);
                        console.error(responseJson);
                        setServerMessageType("danger");
                        setServerMessage(responseJson.error ?? "An unexpected error occured (see console)");
                    })
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                setServerMessage("An unexpected error occured (see console)");
                setServerMessageType('danger');
            });
        } else {
            navigate('/login');
        }
    }, []);

    //Fetch current week num

    return (
        <>
            <Navbar />

            <Container>
                <Row className="pt-5">
                    <Col>
                        <h1 className="text-center">Matchups: Week {weekNum}</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {isLoading ? (
                            <p className="text-center">
                                <Spinner variant="primary"/> Loading matchups...
                            </p>
                        ) : (
                            <>
                                {Array.isArray(matchups?.matchupScores) && matchups.matchupScores.map(matchupScore => (
                                    <>
                                        <Row className="mb-5">
                                            <Col>
                                                <MatchupScoreTable matchupScore={matchupScore} />
                                            </Col>
                                        </Row>
                                    </>
                                ))}
                                <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}