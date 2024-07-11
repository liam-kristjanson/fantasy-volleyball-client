import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />

            <Container className="pt-5">
                <Row>
                    <Col>
                        <h1 className="">Homepage</h1>   
                        <hr/> 
                    </Col>
                </Row>
            </Container>
        </>
    )
}