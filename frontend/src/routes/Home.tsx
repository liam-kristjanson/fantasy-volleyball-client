import { Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import AccountCreationForm from "../components/AccountCreationForm";

export default function Home() {

    const navigate = useNavigate();
    
    return (
        <>
            <Navbar />

            <Container className="pt-5">
                <Row>
                    <Col>
                        <h1 className="">Homepage</h1>   
                        <hr/> 

                        <p className="mb-5">
                            Welcome to the fantasy volleyball client. This is a project I'm working on during my pro season to try to bring the
                            fantasy-sports experience to Canadian volleyball. I'm hoping to attract a number of leagues and
                            to run a smooth experience with most of the features one would expect from a fantasy platform.
                        </p>

                        <h3 className="">Getting started</h3>
                        <hr/>

                        <p>
                            If you're interested in starting a league, please contact me so that I can set up a unique league ID.
                            I hope to automate this process in the future. If you already have an account, <a onClick={() => {navigate('/login')}}className="text-decoration-underline hover-pointer text-dark">log in</a> using the button on the top-right navbar.
                            If you have a leagueId, and want to create an account, please complete the fields below.
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col>
                        <AccountCreationForm />
                    </Col>
                </Row>
            </Container>
        </>
    )
}