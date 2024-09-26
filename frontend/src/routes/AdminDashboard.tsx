import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {

    const user = useAuthContext().state.user;

    const [isScheduleLoading, setIsScheduleLoading] = useState<boolean>(false);

    function createSchedule() {
        setIsScheduleLoading(true);
        
        fetch(import.meta.env.VITE_SERVER + "/admin/create-schedule?leagueId=66ae3e7d54c903e2dcaf1a58", {
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

            <AdminNavbar/>

            <Container>
                <Row className="mb-4 pt-5">
                    <Col>
                        <h1>Admin Dashboard</h1>
                    </Col>
                </Row>

                <Row>
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
            </Container>

            <p>
                Current auth context:
                {JSON.stringify(user)}

            </p>
        </>
    )
}