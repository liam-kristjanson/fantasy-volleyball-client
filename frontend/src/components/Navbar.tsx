import { mdiAccount, mdiHandball, mdiMedal, mdiMenu, mdiSwordCross, mdiVolleyball } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface NavLink {
    route: string,
    text: string,
    iconPath: string 
}

export default function Navbar() {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState<boolean>(false);

    const navLinks : NavLink[] = [
        {
            route: "/players",
            text: "Players",
            iconPath: mdiHandball
        },
        {
            route: "/standings",
            text: "Standings",
            iconPath: mdiMedal
        },
        {
            route: "/matchups",
            text: "Matchups",
            iconPath: mdiSwordCross
        },
        {
            route: "/login",
            text: "Log in",
            iconPath: mdiAccount
        }
    ]
    
    return (
        <>
            <nav className="fixed-top bg-white d-flex justify-content-between p-3 shadow">
                <a className="fw-bold fs-2 text-primary pe-auto text-decoration-none hover-underline hover-pointer" onClick={() => {navigate('/')}}><Icon className="mb-1 me-2" path={mdiVolleyball} size={1.5} />Fantasy Volleyball</a>

                <div id="nav-links-md" className="d-none d-md-flex gap-3 justify-content-around align-items-center fs-5">
                    {navLinks.map((navLink : NavLink) => (
                        <a className="text-primary text-decoration-none hover-underline hover-pointer" onClick={() => {navigate(navLink.route)}}>{navLink.text}<Icon path={navLink.iconPath} size={1}/></a>  
                    ))}
                </div>

                <div id="nav-menu-sm" className="d-md-none text-primary">
                    <a onClick={() => setShowMenu(true)}><Icon path={mdiMenu} size={2}/></a>
                </div>
            </nav>

            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end">
                <Offcanvas.Header closeButton className="">
                    <h2 className="fs-1 text-primary">Menu</h2>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className="d-flex flex-column gap-4">
                        {navLinks.map((navLink : NavLink) => (
                            <Button className="text-white btn-lg" variant="primary" onClick={() => {navigate(navLink.route)}}>{navLink.text} <Icon path={navLink.iconPath} size={1}/> </Button>
                        ))}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <div style={{height:"70px", backgroundColor:"#FFFFFF"}}>
                    {/* move the rest of the content below the sticky header */}
            </div>
        </>
    )
}