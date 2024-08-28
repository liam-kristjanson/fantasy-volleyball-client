import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import { ServerMessageType, Team } from "../types";
import ServerMessageContainer from "./ServerMessageContainer";

interface TeamSelectionDropdownProps {
    leagueId: string;

    selectedTeam: Team | undefined;
    setSelectedTeam: React.Dispatch<React.SetStateAction<Team | undefined>>;
}

export default function TeamSelectionDropdown({leagueId, selectedTeam, setSelectedTeam} : TeamSelectionDropdownProps) {

    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const QUERY_PARAMS = new URLSearchParams({leagueId: leagueId})

        setIsLoading(true);
        setServerMessage("");

        fetch(import.meta.env.VITE_SERVER + "/teams?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                response.json().then(fetchedTeams => {
                    setIsLoading(false);
                    console.log(fetchedTeams);
                    setTeams(fetchedTeams);
                })
            } else {
                response.json().then(responseJson => {
                    setIsLoading(false);
                    setServerMessageType("danger");
                    console.log(responseJson);
                    setServerMessage(responseJson.error ?? "An unexpected error occured");
                })
            }
        })
        
        
    }, [leagueId])

    return (
        <>
            {isLoading ? (
                <>
                    <Spinner variant="primary"/> Loading teams...
                </>
            ) : (
                <DropdownButton variant="primary" title={selectedTeam ? selectedTeam.teamName : "Select a team"}>
                    {teams.map(team => (
                        <Dropdown.Item onClick={() => {setSelectedTeam(team)}}>{team.teamName}</Dropdown.Item>
                    ))}
                </DropdownButton>
            )}

            {serverMessage && <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>}
        </>
    )
}