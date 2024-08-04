import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";

export default function MyAccount() {

    const { user } = useAuthContext().state;

    return (
        <>
            <Navbar/>

            <Container>
                <Row>
                    <Col>
                        <h1 className="text-center pt-5 mb-3">My Account</h1>

                        <p>Current auth context: {JSON.stringify(user) ?? "Not found"}</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}