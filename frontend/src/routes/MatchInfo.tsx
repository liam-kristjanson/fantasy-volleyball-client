import { Col, Container, Row, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MatchDocument } from "../types";

export default function MatchInfo() {

    const { state } = useLocation();

    const [match, setMatch] = useState<MatchDocument>();

    function titleDisplayFormat(gameTitle: string) {
        const outputString = gameTitle.replace(".json", "");

        return outputString;
    }

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/match?matchId=" + state.match?._id)
        .then(response => {
            response.json().then(responseJson => {
                setMatch(responseJson);
            })
        })
    })



    return (
        <>
            <Navbar />

            <Container className='pt-5'>
                <Row>
                    <Col>
                        <h1>Match info: {titleDisplayFormat(state.match?.gameTitle)} Week {state.match?.weekNum}</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>
                                        Player Name
                                    </th>

                                    <th>
                                        K
                                    </th>

                                    <th>
                                        E
                                    </th>

                                    <th>
                                        ATT
                                    </th>

                                    <th>
                                        AST
                                    </th>

                                    <th>
                                        D
                                    </th>

                                    <th>
                                        SA
                                    </th>

                                    <th>
                                        BS
                                    </th>

                                    <th>
                                        BA
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {match && Object.keys(match.stats).map(playerName => (
                                    <tr key={playerName}>
                                        <td>
                                            {playerName}
                                        </td>

                                        <td>
                                            {match.stats[playerName].kills}
                                        </td>

                                        <td>
                                            {match.stats[playerName].errors}
                                        </td>

                                        <td>
                                            {match.stats[playerName].attempts}
                                        </td>

                                        <td>
                                            {match.stats[playerName].assists}
                                        </td>

                                        <td>
                                            {match.stats[playerName].digs}
                                        </td>

                                        <td>
                                            {match.stats[playerName].aces}
                                        </td>

                                        <td>
                                            {match.stats[playerName].soloBlocks}
                                        </td>

                                        <td>
                                            {match.stats[playerName].blockAssists}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}