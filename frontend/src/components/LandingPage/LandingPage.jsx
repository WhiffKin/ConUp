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
                <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/neom-nMzbnMzMjYU-unsplash.jpg"/>
            </div>
            <div className="section2">
                <h3>How Meetup works</h3>
                <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
            </div>
            <div className="section3">
                <NavLink to="/groups">
                    <img src="https://png.pngtree.com/png-vector/20220811/ourmid/pngtree-high-five-hand-partnership-png-image_6104253.png"/>
                    <h5 className="accent-color">See all groups</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
                <NavLink to="/events">
                    <img src="https://cdn.discordapp.com/attachments/1163593560734568488/1187924484058009600/CTEQWGkYVKYJyyrPxExEFh5GDAQurAglyemKshKxID1pIzVuVvvmaS1MjGoPmGHQG69Z5LWSsWgqvMJ4zp0fwpiILByMcBDE6mkmIgcDKxaD61NJLFFMVZCVjcPDq7sOQLX6f0XWUwqp4YhHAAAAAElFTkSuQmCC.png?ex=6598a7e3&is=658632e3&hm=a4d22bda32b0d6835bc36f1b773294c7007ffa5012111be1cfd95d400de7d09f&"/>
                    <h5 className="accent-color">Find an event</h5>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</span>
                </NavLink>
                <NavLink 
                    className={sessionUser === null ? "disabled" : ""}
                    to={sessionUser != null ? "/groups/new" : ""}
                    >
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQBfFALXBLXgsYMw74aH9Xf6Ow__Bffc2Kcg&usqp=CAU"/>
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