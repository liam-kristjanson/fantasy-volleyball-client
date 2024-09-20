import { Table } from "react-bootstrap";
import { StandingsEntry } from "../types";


interface StandingsTableProps {
    standings: StandingsEntry[];
}

export default function StandingsTable({standings} : StandingsTableProps) {
    return (
        <Table striped bordered hover>
            <thead>
                <th>
                    #
                </th>

                <th>
                    Team
                </th>

                <th>
                    Wins
                </th>

                <th>
                    Losses
                </th>
            </thead>

            <tbody>
                {standings.map((standingsEntry, rank) => (
                    <tr key={rank}>
                        <td>
                            {rank + 1}
                        </td>

                        <td>
                            {standingsEntry.teamName}
                        </td>

                        <td>
                            {standingsEntry.wins}
                        </td>

                        <td>
                            {standingsEntry.losses}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}