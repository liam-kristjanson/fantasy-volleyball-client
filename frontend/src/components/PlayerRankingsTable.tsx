import { Spinner, Table } from "react-bootstrap";
import { Player } from "../types"
import { useNavigate } from "react-router-dom";

interface PlayerRankingsTableProps {
    players: Player[];
    isLoading: boolean;
}

export default function PlayerRankingsTable(props: PlayerRankingsTableProps) {

    const navigate = useNavigate();

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Position</th>
                    <th>Points</th>
                </tr>
            </thead>

            <tbody>
                {props.isLoading ? (
                    <tr>
                        <td colSpan={5}>
                            Loading Players... <Spinner variant="primary"/>
                        </td>
                    </tr>
                ) : (
                    props.players.map((player, idx) => (
                        <tr key={player.playerName}>
                            <td>
                                {idx + 1}
                            </td>
                            <td>
                                <a onClick={() => navigate("/player-info", {state: {player: player}})} className="text-black text-decoration-underline hover-pointer">
                                    {player.playerName}
                                </a>
                            </td>
                            <td>
                                {player.team ?? "Unknown"}
                            </td>
                            <td>
                                {player.position ?? "N/A"}
                            </td>

                            <td>
                                {player.seasonTotalPoints.toFixed(1)}
                            </td>

                        </tr>
                    ))
                )}

            </tbody>
        </Table>
    )
}