import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import ServerMessageContainer from "../../components/ServerMessageContainer";
import { LeagueDocument, ServerMessageType, User } from "../../types";
import { useNavigate } from "react-router-dom";
import ControlPanel from "../../components/admin/ControlPanel";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import MatchUploadCluster from "../../components/admin/MatchUploadCluster";

export default function AdminDashboard() {

    const user = useAuthContext().state.user;
    const dispatch = useAuthContext().dispatch;
    const {settings} = useSettingsContext();
    const navigate = useNavigate();

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

    function handleLogout() {
        dispatch({type: "LOGOUT", payload:null});
        navigate('/')
        window.scrollTo(0,0);
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

                                <tfoot>
                                    <tr>
                                        <td colSpan={3}><Button variant="primary" onClick={() => {navigate('/admin/create-league')}}>+ Create League</Button></td>
                                    </tr>
                                </tfoot>
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

                                <tfoot>
                                    <tr>
                                        <td colSpan={5}><Button variant="primary">+ Add User</Button></td>
                                    </tr>
                                </tfoot>
                            </Table>
                        )}

                        <ServerMessageContainer message={usersMessage} variant={usersMessageType}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Control Panel</h3>
                    </Col>
                </Row>

                <ControlPanel/>

                <Row>
                    <Col>
                        <h3>Upload match data: Week {settings.currentWeekNum}</h3>
                    </Col>
                </Row>

                <MatchUploadCluster/>

                <Row>
                    <Col>
                        <h3>Account Managment</h3>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col xs={6}>
                        <Button className="btn-warning btn-lg w-100 fw-bold" onClick={() => {navigate('/change-password')}}>Change Password</Button>
                    </Col>

                    <Col xs={6}>
                        <Button className="btn-primary btn-lg w-100 fw-bold" onClick={() => {handleLogout()}}>Log Out</Button>
                    </Col>
                </Row>
            </Container>

            <p>
                Current auth context:
                {JSON.stringify(user)}
            </p>

            <p>
                Current Settings context:
                {JSON.stringify(settings)}
            </p>
        </>
    )
}