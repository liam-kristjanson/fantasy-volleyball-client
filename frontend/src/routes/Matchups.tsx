import { Carousel, Col, Container, Dropdown, Row, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
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

    //array for possible week numbers to be used in the week-selection dropdown
    const weekNums = []
    for (let i = 1; i<=settings.currentWeekNum; i++) {
        weekNums.push(i);
    }
    

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
    }, [weekNum, navigate, setServerMessage, setServerMessageType, user]);

    //Fetch current week num
    if (!user) return <Navigate to='/login'/>

    return (
        <>
            <Navbar />

            <Container>

                <Row className="pt-5">
                    <Col>
                        <Link to="/my-account" className="text-primary">{'\u2190'} Back to account dashboard</Link>
                    </Col>
                </Row>
                <Row className="pt-5 mb-4 justify-content-center">
                    <Col xs={12}>
                        <h1 className="text-center">Matchups: Week {weekNum}</h1>
                    </Col>

                    <Col xs={12} md={6}>
                        <Dropdown className="mb-3">
                            <Dropdown.Toggle variant="primary" className="w-100">
                                Select a Week
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                                {weekNums.map(weekNum => (
                                    <Dropdown.Item key={weekNum} onClick={() => {setWeekNum(weekNum)}}>Week {weekNum}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Container>

                <Row>
                    <Col>
                        {isLoading ? (
                            <p className="text-center">
                                <Spinner variant="primary"/> Loading matchups...
                            </p>
                        ) : (
                            <>
                                <Carousel className="pb-4" variant="dark">
                                    {Array.isArray(matchups?.matchupScores) && matchups.matchupScores.map((matchupScore, idx) => (
                                        <Carousel.Item key={idx} className="">
                                            <Container>
                                                <Row className="d-flex justify-content-center">
                                                    <Col xs={10}>
                                                        <MatchupScoreTable matchupScore={matchupScore} />    
                                                    </Col>
                                                </Row>
                                            </Container>
                                            
                                        </Carousel.Item>
                                    ))}
                                </Carousel>

                                <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>
                            </>
                        )}
                    </Col>
                </Row>
        </>
    )
}