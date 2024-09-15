import { Card, Spinner, Table } from "react-bootstrap";
import { TeamWeekStatsObject } from "../types";

interface LineupWeekStatsTableProps {
    weekNum: number;
    teamWeekStats: TeamWeekStatsObject | undefined;
    isLoading: boolean;
}

export default function LineupWeekStatsTable(props: LineupWeekStatsTableProps) {
    //const navigate = useNavigate();

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
                            {props.isLoading || !props.teamWeekStats ? (
                                <tr>
                                    <td colSpan={4}>
                                        Weekly stats loading... <Spinner variant="primary"/>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.S?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            S
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.S?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.S?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH1?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            OH1
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH1?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH1?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH2?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            OH2
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH2?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH2?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH3?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            OH3
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH3?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.OH3?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.M1?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            M1
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.M1?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.M1?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.M2?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            M2
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.M2?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.M2?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {props.teamWeekStats?.lineupStats?.L?.playerName ?? "N/A"}
                                        </td>

                                        <td>
                                            L
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.L?.matchesPlayed ?? "N/A"}
                                        </td>

                                        <td>
                                            {props.teamWeekStats?.lineupStats?.L?.points ?? "N/A"}
                                        </td>
                                    </tr>

                                </>
                            )}
                        </tbody>

                        {!props.isLoading && props.teamWeekStats && (
                            <tfoot>
                                <tr>
                                    <td className="fw-bold text-primary" colSpan={3}>
                                        TOTAL:
                                    </td>

                                    <td className="fw-bold text-primary">
                                        {props.teamWeekStats.totalScore.toFixed(1) ?? "N/A"}
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