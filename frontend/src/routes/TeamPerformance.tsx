import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { ServerMessageType, Team, TeamWeekStatsObject } from "../types";
import LineupWeekStatsTable from "../components/LineupWeekStatsTable";
import ServerMessageContainer from "../components/ServerMessageContainer";
import LineupWeekDropdown from "../components/LineupWeekDropdown";
import TeamSelectionDropdown from "../components/TeamSelectionDropdown";

export default function TeamPerformacne() {

    const { user } = useAuthContext().state;

    const [teamWeekStats, setTeamWeekStats] = useState<TeamWeekStatsObject | undefined>(undefined);

    const [lineupWeeks, setLineupWeeks] = useState<number[]>([])

    const [weekNum, setWeekNum] = useState<number>(1);
    const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");

    //synchronization for lineup weeks dropdown
    

    //synchronization for lineup stats table
    useEffect(() => {
        setIsLoading(true);
        setServerMessage("");

        const QUERY_PARAMS = new URLSearchParams({
            userId: selectedTeam?.userId ?? user?.userId ?? "",
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
                setTeamWeekStats(responseJson);
            }
        })
        
    }, [selectedTeam, weekNum, user])

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
                    <Col className="mb-3" sm={3} xl={3}>
                        <TeamSelectionDropdown
                            selectedTeam={selectedTeam}
                            setSelectedTeam={setSelectedTeam}
                            leagueId={user?.leagueId ?? ""}
                        />
                    </Col>

                    <Col className="mb-3" sm={2} xl={1}>
                        <LineupWeekDropdown
                            weekNum={weekNum}
                            setWeekNum={setWeekNum}
                            lineupWeeks={lineupWeeks}
                            setLineupWeeks={setLineupWeeks}
                            leagueId={user?.leagueId ?? ""}
                            userId={selectedTeam?.userId ?? user?.userId ?? ""}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <LineupWeekStatsTable
                            weekNum={weekNum}
                            isLoading={isLoading}
                            teamWeekStats={teamWeekStats}
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