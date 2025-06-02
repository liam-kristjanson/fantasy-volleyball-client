import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import FreeAgentsTable from "../components/FreeAgentsTable";
import { Link } from "react-router-dom";

export default function FreeAgents() {
    return (
        <>
            <Navbar />

            <Container className="pt-5">
                <Row className="mb-2">
                    <Col>
                        <Link to="/my-account" className="text-primary">{'\u2190'} Back to account dashboard</Link>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h1 className="">Free Agents</h1>
                        <hr/>

                        <FreeAgentsTable />
                    </Col>
                </Row>
            </Container>
        </>
    )
}