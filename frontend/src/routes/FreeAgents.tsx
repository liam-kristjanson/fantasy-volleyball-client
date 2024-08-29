import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import FreeAgentsTable from "../components/FreeAgentsTable";

export default function FreeAgents() {
    return (
        <>
            <Navbar />

            <Container className="pt-5">
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