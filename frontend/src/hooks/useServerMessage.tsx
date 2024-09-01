import { useState } from "react";
import { ServerMessageType } from "../types";

export default function useServerMessage() {
    const [serverMessage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<ServerMessageType>("info");

    return {serverMessage, setServerMessage, serverMessageType, setServerMessageType}
}