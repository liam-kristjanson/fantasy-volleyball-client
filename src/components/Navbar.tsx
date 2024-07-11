import { mdiAccount, mdiHandball, mdiMedal, mdiSwordCross, mdiVolleyball } from "@mdi/js";
import Icon from "@mdi/react";

export default function Navbar() {
    return (
        <>
            <nav className="fixed-top bg-white d-flex justify-content-between p-3 shadow">
                <a className="fw-bold fs-2 text-primary pe-auto text-decoration-none" href="#"><Icon className="mb-1" path={mdiVolleyball} size={1.5} /> Fantasy Volleyball</a>

                <div id="nav-links-md" className="d-none d-md-flex gap-3 justify-content-around align-items-center fs-5">
                    <a className="text-primary text-decoration-none" href="#">Players <Icon path={mdiHandball} size={1}/></a>
                    <a className="text-primary text-decoration-none" href="#">Standings <Icon path={mdiMedal} size={1}/></a>
                    <a className="text-primary text-decoration-none" href="#">Matchups <Icon path={mdiSwordCross} size={1}/></a>
                    <a className="text-primary text-decoration-none" href="#">Log in <Icon path={mdiAccount} size={1} /></a>    
                </div> 
            </nav>
        </>
    )
}