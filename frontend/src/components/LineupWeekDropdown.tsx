import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Spinner } from "react-bootstrap"
import ServerMessageContainer from "./ServerMessageContainer";
import { ServerMessageType } from "../types";

interface LineupWeekDropdownProps {
    weekNum: number;
    setWeekNum: React.Dispatch<React.SetStateAction<number>>;
    
    lineupWeeks: number[];
    setLineupWeeks: React.Dispatch<React.SetStateAction<number[]>>;

    userId: string;
    leagueId: string;
}

export default function LineupWeekDropdown(props: LineupWeekDropdownProps) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");

    useEffect(() => {
        setIsLoading(true);

        const QUERY_PARAMS = new URLSearchParams({
            userId: props.userId,
            leagueId: props.leagueId
        });

        fetch(import.meta.env.VITE_SERVER + "/lineup/max-week?" + QUERY_PARAMS.toString())
        .then(response => {
            if (response.ok) {
                setServerMessageType("success");
            } else {
                setServerMessageType("danger");
            }
            return response.json();
        })
        .then(responseJson => {
            console.log("Done loading lineup weeks")
            console.log(responseJson);
            setIsLoading(false);

            if (responseJson.error) {
                setServerMessage(responseJson.error);
            } else {
                //generate array of week numbers from 1 ... max week returned
                props.setLineupWeeks(Array.from(Array(responseJson.weekNum).keys()).map(n => n+1))
            }
        })
    }, [])

    return (
        <>
            {isLoading ? (
                <>
                    Loading lineups... <Spinner variant="primary"/>
                </>
            ) : (
                props.lineupWeeks.length <= 0 ? (
                    <DropdownButton id="week-num-dropdown" title={"No lineups found!"}>
                        <Dropdown.Item>Failed to load lineup weeks</Dropdown.Item>
                    </DropdownButton>
                ) : (
                    <DropdownButton id="week-num-dropdown" title={"Week " + props.weekNum}>
                        {props.lineupWeeks.map(weekNum => (
                            <Dropdown.Item onClick={() => {props.setWeekNum(weekNum)}}>{"Week " + weekNum}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                )
            )}

            

            {serverMessage && <ServerMessageContainer message={serverMessage} variant={serverMessageType}/>}
        </>
    )
}