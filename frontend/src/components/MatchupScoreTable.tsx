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
                        Home Team
                    </th>

                    <th className="text-center">
                        VS.
                    </th>

                    <th>
                        Away Team
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
                        {homePlayer ? (
                            <a onClick={() => {navigate('/player-info', {state:{player: homePlayer}})}}>
                                {homePlayer.playerName}
                            </a>
                        ) : (
                            "N/A"
                        )}
                    </div>

                    <div>
                        {homePlayer?.points ?? 0}
                    </div>
                </div>                    
            </td>

            <td className="text-center">
                {position}
            </td>

            <td>
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        {awayPlayer?.points ?? 0}
                    </div>

                    <div>
                        {awayPlayer ? (
                            <a onClick={() => {navigate('/player-info', {state:{player: awayPlayer}})}}>
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