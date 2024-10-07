import { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function MatchUploadCluster() {
    const {settings} = useSettingsContext();
    const {user} = useAuthContext().state;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    //const [fileList, setFileList] = useState<FileList | null>(null);
    const [fileTexts, setFileTexts] = useState<string[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);



    function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {

        const numFiles = e.target.files?.length ?? 0

        const fileTextPromises : Promise<string>[] = [];
        const fileNames : string[] = []

        for (let i = 0; i<numFiles; i++) {
            if (e.target.files) {
                fileTextPromises.push(e.target.files[i].text());
                fileNames.push(e.target.files[i].name)
            }
        }

        setFileNames(fileNames);
        console.log("File names: ", fileNames)

        Promise.all(fileTextPromises)
        .then(fileTexts => {
            console.log("Resolved all file texts");
            setFileTexts(fileTexts);
            
            for (let i = 0; i<fileTexts.length; i++) {
                console.log(JSON.parse(fileTexts[i]));
            }
        })
    }

    function handleSubmit() {
        setIsLoading(true);

        for (let i = 0; i<fileTexts.length; i++) {
            const QUERY = new URLSearchParams({
                weekNum: settings.currentWeekNum.toString(),
                season: settings.currentSeason,
                gameTitle: fileNames[i]
            })

            fetch(import.meta.env.VITE_SERVER + "/admin/match-data?" + QUERY.toString(), {
                method: "POST",
                headers: {
                    "Authorization": user?.authToken ?? "",
                    "content-type": "application/json" 
                },
                body: fileTexts[i]
            })
            .then(response => {
                setIsLoading(false);
                return response.json();
            })
            .then(responseJson => {
                alert(JSON.stringify(responseJson));
            })
            .catch(err => {
                console.error(err);
                alert(err);
            })
        }
    }

    if (isLoading) {
        return (
            <>
                <Spinner variant="primary"/> Uploading match data...
            </>
        )
    }

    return (
        <>
            <Row>
                <Form.Group controlId="match-data-files-upload" className="col-6 mb-3">
                    <Form.Control type="file" multiple onChange={(e : React.ChangeEvent<HTMLInputElement>) => {handleFilesChange(e)}}/>
                </Form.Group>

                <Col xs={6}>
                    <Button onClick={() => {handleSubmit()}}className="w-100">Submit</Button>
                </Col>
                
            </Row>
        </>
    )
}