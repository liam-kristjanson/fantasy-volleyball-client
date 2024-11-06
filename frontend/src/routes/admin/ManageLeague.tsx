import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import { LeagueDocument } from "../../types";
import LeagueUsersTable from "../../components/admin/LeagueUsersTable";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ManageLeague() {

    const {state} = useLocation();
    const {user} = useAuthContext().state;
    const league: LeagueDocument = state.league;
    const navigate = useNavigate();

    const [isScheduleLoading, setIsScheduleLoading] = useState<boolean>(false);

    function createSchedule() {
        setIsScheduleLoading(true);
        
        fetch(import.meta.env.VITE_SERVER + "/admin/create-schedule?leagueId=" + league._id, {
            headers: {
                "content-type": "application/json",
                "Authorization": user?.authToken ?? ""
            },
            method: "POST"
        })
        .then(response => {
            if (response.ok) {
                response.json().then(responseJson => {
                    setIsScheduleLoading(false);
                    alert(JSON.stringify(responseJson));
                })
            } else {
                response.json().then(responseJson => {
                    setIsScheduleLoading(false);
                    alert(JSON.stringify(responseJson));
                })
            }
        })
        .catch(err => {
            setIsScheduleLoading(false);
            alert(err);
        })
    }

    return (
        <>
            <AdminNavbar />

            <Container>
                <Row className="pt-5 mb-3">
                    <Col>
                        <h1>Manage League: {league.name}</h1>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        {isScheduleLoading ? (
                            <>
                                <Spinner variant="primary"/> Creating schedule...
                            </>
                        ) : (
                            <Button onClick={() => {createSchedule()}}variant="primary">Create Schedule</Button>
                        )}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <h3>Users</h3>
                        <LeagueUsersTable leagueId={league._id}/>
                        <Button className="btn-primary" onClick={() => {navigate("/admin/add-user", {state: {league}})}}>+ Add User</Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Matchups</h3>
                    </Col>
                </Row>
            </Container>
        </>
    )
}