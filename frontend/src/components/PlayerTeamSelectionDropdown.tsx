import { Dispatch, SetStateAction } from "react";
import { Dropdown } from "react-bootstrap"

interface PlayerTeamSelectionDropdownProps {
    selectedTeam: string | undefined;
    setSelectedTeam : Dispatch<SetStateAction<string | undefined>>
}

export default function PlayerTeamSelectionDropdown({selectedTeam, setSelectedTeam} : PlayerTeamSelectionDropdownProps) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="w-100">
                {selectedTeam ?? "Team"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => {setSelectedTeam(undefined)}}> -- ALL -- </Dropdown.Item>
                {['ALB', 'BDN', 'CGY', 'GMU', 'MAN', 'MRU', 'SSK', 'TRU', 'TWU', 'UBC', 'UBCO', 'UFV', 'WIN'].map(teamName => (
                    <Dropdown.Item onClick={() => {setSelectedTeam(teamName)}}key={teamName}>{teamName}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}