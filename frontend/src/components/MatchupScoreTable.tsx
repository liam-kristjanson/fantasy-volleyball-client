import { Table } from "react-bootstrap";
import { MatchupScore, PlayerWeekStats } from "../types";
import { useNavigate } from "react-router-dom";

interface MatchupScoreTableProps {
    matchupScore: MatchupScore;
}

export default function MatchupScoreTable({matchupScore} : MatchupScoreTableProps) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>
                        {matchupScore.homeTeam.teamName}
                    </th>

                    <th className="text-center">
                        VS.
                    </th>

                    <th>
                        {matchupScore.awayTeam.teamName}
                    </th>
                </tr>
            </thead>

            <tbody>
                
                <MatchupTableRow 
                    homePlayer={matchupScore.homeTeam.lineupStats.S} 
                    awayPlayer={matchupScore.awayTeam.lineupStats.S}
                    position="S"
                />

                <MatchupTableRow
                    homePlayer={matchupScore.homeTeam.lineupStats.OH1}
                    awayPlayer={matchupScore.awayTeam.lineupStats.OH1}
                    position="OH1"
                />

                <MatchupTableRow
                    homePlayer={matchupScore.homeTeam.lineupStats.OH2}
                    awayPlayer={matchupScore.awayTeam.lineupStats.OH2}
                    position="OH2"
                />

                <MatchupTableRow
                    homePlayer={matchupScore.homeTeam.lineupStats.OH3}
                    awayPlayer={matchupScore.awayTeam.lineupStats.OH3}
                    position="OH3"
                />

                <MatchupTableRow
                    homePlayer={matchupScore.homeTeam.lineupStats.M1}
                    awayPlayer={matchupScore.awayTeam.lineupStats.M1}
                    position="M1"
                />

                <MatchupTableRow
                    homePlayer={matchupScore.homeTeam.lineupStats.M2}
                    awayPlayer={matchupScore.awayTeam.lineupStats.M2}
                    position="M2"
                />

                <MatchupTableRow
                    homePlayer={matchupScore.homeTeam.lineupStats.L}
                    awayPlayer={matchupScore.awayTeam.lineupStats.L}
                    position="L"
                />

                
            </tbody>

            <tfoot>
                <tr>
                    <td className="fw-bold text-center">
                        Total: {matchupScore.homeTeam.totalScore}
                    </td>

                    <td className="fw-bold text-center">
                        {matchupScore.homeTeam.totalScore > matchupScore.awayTeam.totalScore ? (
                            matchupScore.homeTeam.teamName + " wins"
                        ) : (
                            matchupScore.awayTeam.teamName + " wins"
                        )}
                    </td>

                    <td className="fw-bold text-center">
                        Total: {matchupScore.awayTeam.totalScore.toFixed(1)}
                    </td>
                </tr>
            </tfoot>
        </Table>
    )
}

interface MatchupTableRowProps {
    position: string;
    homePlayer: PlayerWeekStats | undefined;
    awayPlayer: PlayerWeekStats | undefined;
}

function MatchupTableRow({position, homePlayer, awayPlayer} : MatchupTableRowProps) {

    const navigate = useNavigate();

    return (
        <tr>
            <td>
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        {homePlayer?.playerName ? (
                            <a className="td-underline hover-pointer text-dark" onClick={() => {navigate('/player-info', {state:{player: homePlayer}})}}>
                                {homePlayer.playerName}
                            </a>
                        ) : (
                            "N/A"
                        )}
                    </div>

                    <div>
                        {(homePlayer?.points ?? 0).toFixed(1)}
                    </div>
                </div>                    
            </td>

            <td className="text-center">
                {position}
            </td>

            <td>
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        {(awayPlayer?.points ?? 0).toFixed(1)}
                    </div>

                    <div>
                        {awayPlayer?.playerName ? (
                            <a className="td-underline hover-pointer text-dark" onClick={() => {navigate('/player-info', {state:{player: awayPlayer}})}}>
                                {awayPlayer.playerName}
                            </a>
                        ) : (
                            "N/A"
                        )}
                    </div>
                </div>                     
            </td>
        </tr>
    )
}