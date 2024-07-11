import { Card, Col, Container, Row, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Players() {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/api/statsobject")
        .then(response => {
            setIsLoading(false);
            if (response.ok) return response.json();
        })
        .then(responseJson => {
            console.log(responseJson);
        })
    }, [])

    return (
        <>
            <Navbar />

            <Container className="pt-5">
                <Row>
                    <Col>
                        <h1>Players</h1>
                        <hr/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className="shadow">
                            <Card.Header className="text-primary fw-bold">
                                Top Players
                            </Card.Header>

                            <Card.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Points</th>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                1
                                            </td>

                                            <td>
                                                Liam Kristjanson
                                            </td>

                                            <td>
                                                123.4
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                1
                                            </td>

                                            <td>
                                                Liam Kristjanson
                                            </td>

                                            <td>
                                                123.4
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                1
                                            </td>

                                            <td>
                                                Liam Kristjanson
                                            </td>

                                            <td>
                                                123.4
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                1
                                            </td>

                                            <td>
                                                Liam Kristjanson
                                            </td>

                                            <td>
                                                123.4
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {isLoading && <p>Loading...</p>}
            </Container>
        </>
    )
}