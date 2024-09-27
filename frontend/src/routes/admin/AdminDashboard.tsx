import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import ServerMessageContainer from "../../components/ServerMessageContainer";
import { LeagueDocument, ServerMessageType, User } from "../../types";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const user = useAuthContext().state.user;
    const navigate = useNavigate();

    const [isScheduleLoading, setIsScheduleLoading] = useState<boolean>(false);

    //state variables for league
    const [isLeaguesLoading, setIsLeaguesLoading] = useState<boolean>(false);
    const [leagues, setLeagues] = useState<LeagueDocument[]>([]);
    const [leagueMessage, setLeagueMessage] = useState<string>("");
    const [leagueMessageType, setLeagueMessageType] = useState<ServerMessageType>("info");

    //state variables for users
    const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [usersMessage, setUsersMessage] = useState<string>("");
    const [usersMessageType, setUsersMessageType] = useState<ServerMessageType>("info");


    //fetch league information
    useEffect(() => {
        setIsLeaguesLoading(true);
        fetch(import.meta.env.VITE_SERVER + "/admin/leagues",
            {
                headers: {Authorization: user?.authToken ?? ""}
            }
        )
        .then(response => {
            setIsLeaguesLoading(false);
            if (response.ok) {
                response.json().then(responseJson => {
                    console.log("Leagues fetched successfully:", responseJson)
                    setLeagues(responseJson);
                })
            } else {
                response.json().then(responseJson => {
                    setLeagueMessage(responseJson.error ?? "An unexpected error occured");
                    setLeagueMessageType('danger');
                    console.error(responseJson);
                })
            }
        })
        .catch(err => {
            setIsLeaguesLoading(false);
            setLeagueMessageType('danger');
            setLeagueMessage("An unexpected error occured (see console)");
            console.error(err);
        })
    }, [user]);

    //fetch user information
    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/admin/users",
            {
                headers: {Authorization: user?.authToken ?? ""}
            }
        )
        .then(response => {
            setIsUsersLoading(false);
            response.json().then(responseJson => {
                if (response.ok) {
                    console.log("Users fetched successfuly", responseJson);
                    setUsers(responseJson);
                } else {
                    console.error(responseJson);
                    setUsersMessage(responseJson.error ?? "An unexpected error occured (see console)");
                    setUsersMessageType('danger');
                }
            })
        })
        .catch(err => {
            setIsUsersLoading(false);
            console.error(err);
            setUsersMessage("An unexpected error occured (see console)");
            setUsersMessageType("danger");
        })
    }, [user])
    

    function createSchedule() {
        setIsScheduleLoading(true);
        
        fetch(import.meta.env.VITE_SERVER + "/admin/create-schedule?leagueId=66ae3e7d54c903e2dcaf1a58", {
            headers: {
                "content-type": "application/json",
                "Authorization": user?.authToken ?? ""
            },
            method: "POST"
        })
        .then(response => {
            if (response.ok) {
                response.json().then(responseJson => {
                    setIsScheduleLoading(false);
                    alert(JSON.stringify(responseJson));
                })
            } else {
                response.json().then(responseJson => {
                    setIsScheduleLoading(false);
                    alert(JSON.stringify(responseJson));
                })
            }
        })
        .catch(err => {
            setIsScheduleLoading(false);
            alert(err);
        })
    }

    return (
        <>

            <AdminNavbar/>

            <Container>
                <Row className="mb-4 pt-5">
                    <Col>
                        <h1>Admin Dashboard</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Leagues ({leagues.length})</h3>

                        {isLeaguesLoading ? (
                            <>
                                <Spinner variant="primary"/> Leagues loading...
                            </>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            leagueId
                                        </th>

                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {leagues.map((league, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                {league.name}
                                            </td>

                                            <td>
                                                {league._id}
                                            </td>

                                            <td>
                                                <Button variant="primary" onClick={() => {navigate("/admin/manage-league", {state: {league}})}}>Manage</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        
                        <ServerMessageContainer message={leagueMessage} variant={leagueMessageType}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Users ({users.length})</h3>

                        {isUsersLoading ? (
                            <>
                                <Spinner variant="priamry"/> Users loading...
                            </>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>
                                            Username
                                        </th>

                                        <th>
                                            LeagueId
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            UserId
                                        </th>

                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                {user.username}
                                            </td>

                                            <td>
                                                {user.leagueId}
                                            </td>

                                            <td>
                                                {user.role}
                                            </td>

                                            <td>
                                                {user._id}
                                            </td>

                                            <td>
                                                <Button variant="primary" onClick={() => {navigate('/admin/manage-user', {state: {selectedUser: user}})}}>Manage</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        <ServerMessageContainer message={usersMessage} variant={usersMessageType}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {isScheduleLoading ? (
                            <>
                                <Spinner variant="primary"/> Creating schedule...
                            </>
                        ) : (
                            <Button onClick={() => {createSchedule()}}variant="primary">Create Schedule</Button>
                        )}
                    </Col>
                </Row>
            </Container>

            <p>
                Current auth context:
                {JSON.stringify(user)}

            </p>
        </>
    )
}