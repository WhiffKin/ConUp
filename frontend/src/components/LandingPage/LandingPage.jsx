import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SignupFormModal from "../SignupFormModal";
import "./LandingPage.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);
  
    return (
        <main className="mainLandingPage">
            <div className="section1">
                <div>
                    <h1>The people platform- Where interests become friendships</h1>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                </div>
                <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_1.jpg"/>
            </div>
            <div className="section2">
                <NavLink to="/about-me">
                    <h3>Meet the Dev</h3>
                    <span>Learn more about me, <br/>Garrett Lackey by clicking here!</span>
                </NavLink>
            </div>
            <div className="section3">
                <NavLink to="/groups">
                    <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_group.png"/>
                    <h5 className="accent-color">See all groups</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
                <NavLink to="/events">
                    <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_ticket.webp"/>
                    <h5 className="accent-color">Find an event</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
                <NavLink 
                    className={sessionUser === null ? "disabled" : ""}
                    to={sessionUser != null ? "/groups/new" : ""}
                    >
                    <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_host.jpg"/>
                    <h5 className="accent-color">Start a new group</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
            </div>
            {sessionUser === null  &&
                <div className="section4">
                    <OpenModalMenuItem
                        itemText="Join Meetup"
                        modalComponent={<SignupFormModal />}
                        />
                </div>
            }
        </main>
    );
}

export default LandingPage;