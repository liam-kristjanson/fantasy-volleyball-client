import { Table } from "react-bootstrap";

interface LeagueMatchupsTableProps {
    leagueId: string;
}

export default function LeagueMatchupsCluster({leagueId} : LeagueMatchupsTableProps) {

    return (
        <Table striped bordered hover>

        </Table>
    )
}