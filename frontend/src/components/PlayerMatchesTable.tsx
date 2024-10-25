import { Spinner, Table } from "react-bootstrap";
import { Player, PlayerMatch } from "../types";
import { useEffect, useState } from "react";
import useServerMessage from "../hooks/useServerMessage";
import ServerMessageContainer from "./ServerMessageContainer";

interface PlayerMatchesTableProps {
    player: Player;
}

function titleDisplayFormat(gameTitle: string) {
    const outputString = gameTitle.replace(".json", "");

    return outputString;
}

export default function PlayerMatchesTable({player} : PlayerMatchesTableProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
    const {serverMessage, serverMessageType, setServerMessage, setServerMessageType} = useServerMessage();

    useEffect(() => {
        setIsLoading(true);
        setServerMessage("");
        fetch(import.meta.env.VITE_SERVER + "/player-matches?id=" + player._id)
        .then(response => {
            return response.json();
        })
        .then(responseJson => {
            console.log(responseJson);
            setPlayerMatches(responseJson);
            setIsLoading(false);
        })
        .catch(err => {
            setIsLoading(false);
            setServerMessageType('danger'); 
            setServerMessage("An unexpected error occured: " + err);
        })
    }, [setServerMessage, setServerMessageType, player])

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="d-none d-sm-table-cell">
                            Week
                        </th>

                        <th>
                            Title
                        </th>

                        <th className="d-none d-lg-table-cell">
                            Kills
                        </th>

                        <th className="d-none d-lg-table-cell">
                            Errors
                        </th>

                        <th className="d-none d-lg-table-cell">
                            Attempts
                        </th>

                        <th className="d-none d-sm-table-cell">
                            EFF
                        </th>

                        <th className="d-none d-lg-table-cell">
                            Assists
                        </th>

                        <th className="d-none d-lg-table-cell">
                            Aces
                        </th>

                        <th className="d-none d-lg-table-cell">
                            Digs
                        </th>

                        <th className="d-none d-lg-table-cell">
                            BS
                        </th>

                        <th className="d-none d-lg-table-cell">
                            BA
                        </th>

                        <th>
                            PTS
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={12}>
                                Player matches loading...
                                <Spinner variant="primary"/>
                            </td>
                        </tr>
                    ) : (
                        playerMatches.map(match => (
                            <tr>
                                <td className="d-none d-sm-table-cell">
                                    {match.weekNum}
                                </td>

                                <td>
                                    {titleDisplayFormat(match.gameTitle)}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.kills}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.errors}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.attempts}
                                </td>

                                <td className="d-none d-sm-table-cell">
                                    {(match.stats.attempts > 0) ? ((match.stats.kills - match.stats.errors) / match.stats.attempts).toFixed(3) : "0.000"}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.assists}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.aces}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.digs}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.soloBlocks}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {match.stats.blockAssists}
                                </td>

                                <td className="fw-bold">
                                    {match.stats.fantasyPoints?.toFixed(1) ?? "N/A"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {serverMessage && <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>}
        </>
    )
}