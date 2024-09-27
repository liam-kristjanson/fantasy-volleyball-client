import { Col, Container, Row } from "react-bootstrap";
import AdminNavbar from "../../components/AdminNavbar";
import { useLocation } from "react-router-dom";
import { LeagueDocument } from "../../types";
import LeagueUsersTable from "../../components/admin/LeagueUsersTable";

export default function ManageLeague() {

    const {state} = useLocation();
    const league: LeagueDocument = state.league;

    return (
        <>
            <AdminNavbar />

            <Container>
                <Row className="pt-5 mb-5">
                    <Col>
                        <h1>Manage League: {league.name}</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Users</h3>
                        <LeagueUsersTable leagueId={league._id}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}