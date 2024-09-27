import { useLocation } from "react-router-dom";
import { User } from "../../types";
import AdminNavbar from "../../components/AdminNavbar";
import { Col, Container, Row } from "react-bootstrap";


export default function ManageUser() {

    const locationState = useLocation().state;
    const selectedUser : User = locationState.selectedUser;


    return (
        <>
            <AdminNavbar />

            <Container>
                <Row className="pt-5 mb-5">
                    <Col>
                        <h1>Manage User: {selectedUser.username}</h1>
                    </Col>
                </Row>
            </Container>
        </>
    )
}