import { ServerMessageType } from "../types";

interface ServerMessageContainerProps {
    message: string;
    variant: ServerMessageType;
}

export default function ServerMessageContainer(props: ServerMessageContainerProps) {
    return (
        <p className={"text-" + props.variant + " fw-bold"}>{props.message}</p>
    )
}