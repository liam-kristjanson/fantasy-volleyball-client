import { Dispatch, SetStateAction } from "react";
import { Dropdown } from "react-bootstrap"

interface PositionSelectionDropdownProps {
    selectedPosition: string | undefined;
    setSelectedPosition: Dispatch<SetStateAction<string | undefined>>
}

export default function PositionSelectionDropdown({selectedPosition, setSelectedPosition} : PositionSelectionDropdownProps) {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle className="w-100">
                    {selectedPosition ?? "Position"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {setSelectedPosition(undefined)}}> -- ALL -- </Dropdown.Item>
                    {['S', 'OH', 'M', 'L'].map(position => (
                        <Dropdown.Item onClick={() => {setSelectedPosition(position)}} key={position}>{position}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>

            </Dropdown>
        </>
    )
}