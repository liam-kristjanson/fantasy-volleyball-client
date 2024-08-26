import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { PlayerWeekStats, ServerMessageType } from "../types";
import LineupWeekStatsTable from "../components/LineupWeekStatsTable";
import ServerMessageContainer from "../components/ServerMessageContainer";
import LineupWeekDropdown from "../components/LineupWeekDropdown";

export default function TeamPerformacne() {

    const { user } = useAuthContext().state;

    const [lineupWeekStats, setLineupWeekStats] = useState<PlayerWeekStats[]>([]);

    const [lineupWeeks, setLineupWeeks] = useState<number[]>([])

    const [weekNum, setWeekNum] = useState<number>(1);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");

    //synchronization for lineup weeks dropdown
    

    //synchronization for lineup stats table
    useEffect(() => {
        setIsLoading(true);

        const QUERY_PARAMS = new URLSearchParams({
            userId: user?.userId ?? "",
            leagueId: user?.leagueId ?? "",
            weekNum: weekNum.toString()
        })

        fetch(import.meta.env.VITE_SERVER + "/lineup/score?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                setServerMessageType("success");
            } else {
                setServerMessageType("danger");
            }

            return response.json();
        })
        .then(responseJson => {
            setIsLoading(false);
            if (responseJson.error) {
                setServerMessage(responseJson.error ?? "An unexpected error occured");
                console.log(responseJson);
            } else {
                console.log(responseJson);
                setLineupWeekStats(responseJson);
            }
        })
        
    }, [weekNum, user])

    return (
        <>

            <Navbar/>

            <Container>
                <Row>
                    <Col>
                        <h1 className="text-center pt-5 mb-3">Team Performance</h1>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-3" sm={2} xl={1}>
                        <DropdownButton className="w-100" title={"Team 1"}>
                            <Dropdown.Item>Team 1</Dropdown.Item>
                            <Dropdown.Item>Team 2</Dropdown.Item>
                            <Dropdown.Item>Team 3</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                    <Col className="mb-3" sm={2} xl={1}>
                        <LineupWeekDropdown
                            weekNum={weekNum}
                            setWeekNum={setWeekNum}
                            lineupWeeks={lineupWeeks}
                            setLineupWeeks={setLineupWeeks}
                            leagueId={user?.leagueId ?? ""}
                            userId={user?.userId ?? ""}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <LineupWeekStatsTable
                            weekNum={weekNum}
                            isLoading={isLoading}
                            lineupWeekStats={lineupWeekStats}
                        />
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