import { Card, Spinner, Table } from "react-bootstrap";
import { PlayerWeekStats } from "../types";
import { useNavigate } from "react-router-dom";

interface LineupWeekStatsTableProps {
    weekNum: number;
    lineupWeekStats: PlayerWeekStats[];
    isLoading: boolean;
}

export default function LineupWeekStatsTable(props: LineupWeekStatsTableProps) {
    const navigate = useNavigate();

    return (
        <>
            <Card className="shadow">
                <Card.Header>
                    Stats for Week {props.weekNum}
                </Card.Header>

                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    Player
                                </th>

                                <th>
                                    Position
                                </th>

                                <th>
                                    Matches Played
                                </th>

                                <th>
                                    Points
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {props.isLoading ? (
                                <tr>
                                    <td colSpan={4}>
                                        Weekly stats loading... <Spinner variant="primary"/>
                                    </td>
                                </tr>
                            ) : (
                                props.lineupWeekStats.map((playerWeekStats, idx) => (
                                    <tr key={idx}>
                                        <td>
                                        <a onClick={() => navigate("/player-info", {state: {player: playerWeekStats}})} className="text-black text-decoration-underline hover-pointer">
                                            {playerWeekStats.playerName}
                                        </a>
                                        </td>

                                        <td>
                                            {playerWeekStats.position}
                                        </td>

                                        <td>
                                            {playerWeekStats.matchesPlayed}
                                        </td>

                                        <td>
                                            {playerWeekStats.points}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    )
}