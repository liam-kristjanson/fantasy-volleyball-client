import { createContext, ReactElement, useEffect, useState } from "react";
import { AppSettings, SettingsContextState } from "../types";

const contextDefaultValues : SettingsContextState = {
    settings: {
        currentWeekNum: 1,
        currentSeason: "2023-2024",
        lineupsLocked: false
    },
    updateSettings: () => {}
}

export const SettingsContext = createContext<SettingsContextState>(contextDefaultValues);

type ProviderProps = {
    children: ReactElement;
}

export const SettingsProvider : React.FC<ProviderProps> = (props) => {
    const [settings, setSettings] = useState<AppSettings>(contextDefaultValues.settings);

    const updateSettings = () => {
        //alert("Updating settings with " + JSON.stringify(newSettings));
        fetchSettings();
    }

    function fetchSettings() {
        fetch(import.meta.env.VITE_SERVER + "/app-settings")
        .then(response => {
        response.json()
        .then(responseJson => {
            //alert('calling update settings')
            setSettings(responseJson);
        })
        })
        .catch(err => {
        alert('Error fetching settings (see console)')
        console.error(err)
        })
    }

    useEffect(() => {
         fetchSettings();
    }, [])

    return (
        <SettingsContext.Provider value={{settings, updateSettings}}>
            {props.children}
        </SettingsContext.Provider>
    )
}