import { Card, Spinner, Table } from "react-bootstrap";
import { PlayerRanking } from "../types"

interface PlayerRankingsTableProps {
    playerRankings: PlayerRanking[];
    isLoading: boolean;
}

export default function PlayerRankingsTable(props: PlayerRankingsTableProps) {

    return (
        <Card className="shadow mb-5">
            <Card.Header className="text-primary fw-bold">
                Top Players
            </Card.Header>

            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Points</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.isLoading ? (
                            <tr>
                                <td colSpan={3}>
                                    Loading... <Spinner variant="primary"/>
                                </td>
                            </tr>
                        ) : (
                            props.playerRankings.map((player, idx) => (
                                <tr key={player.playerName}>
                                    <td>
                                        {idx + 1}
                                    </td>

                                    <td>
                                        {player.playerName}
                                    </td>

                                    <td>
                                        {player.prevSeasonPoints}
                                    </td>
                                </tr>
                            ))
                        )}
    
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    )
}