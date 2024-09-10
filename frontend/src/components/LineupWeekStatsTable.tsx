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

    let totalPoints = 0;

    if (Array.isArray(props.lineupWeekStats)) {
        for (let i = 0; i<props.lineupWeekStats.length; i++) {
            totalPoints += props.lineupWeekStats[i].points ?? 0;
        }
    }

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
                                            {playerWeekStats.playerName ?? "N/A"}
                                        </a>
                                        </td>

                                        <td>
                                            {playerWeekStats.position ?? "N/A"}
                                        </td>

                                        <td>
                                            {playerWeekStats.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {playerWeekStats.points ?? "N/A"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {Array.isArray(props.lineupWeekStats) && (
                            <tfoot>
                                <tr>
                                    <td className="fw-bold text-primary" colSpan={3}>
                                        TOTAL:
                                    </td>

                                    <td className="fw-bold text-primary">
                                        {totalPoints.toFixed(1)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </Table>
                </Card.Body>
            </Card>
        </>
    )
}