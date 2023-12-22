import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LandingPage.css";

function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <main className="mainLandingPage">
            <div className="section1">
                <div>
                    <h1>The people platform- Where interests become friendships</h1>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                </div>
                <img src="FakeImage"/>
            </div>
            <div className="section2">
                <h3>How Meetup works</h3>
                <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
            </div>
            <div className="section3">
                <NavLink to="/groups">
                    <img src="FakeImage"/>
                    <h5>See all groups</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
                <NavLink to="/events">
                    <img src="FakeImage"/>
                    <h5>Find an event</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
                <NavLink 
                    className={sessionUser === null ? "disabled" : ""}
                    to={sessionUser != null ? "/groups/new" : ""}
                    >
                    <img src="FakeImage"/>
                    <h5>Start a new group</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
            </div>
            <div className="section4">
                <button>Join Meetup</button>
            </div>
        </main>
    );
}

export default LandingPage;