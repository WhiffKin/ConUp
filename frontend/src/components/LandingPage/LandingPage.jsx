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
                    <span>
                        Looking for a convention? You&apos;ve come to the right place! Check out our events to sift through the various cons being hosted. When you find a convention you like, check out the group to see other similar events being hosted!
                        <br/>
                        <br/>
                        If you have a con to share with the world, create a 
                        {" "}
                        { sessionUser === null ? 
                            <OpenModalMenuItem
                                itemText="Group"
                                modalComponent={<SignupFormModal />}
                                />
                            : <NavLink to="/groups/new"> Group</NavLink>
                        }
                        {" "}
                        and add an event from the Group page!
                         </span>
                </div>
                <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_1.jpg"/>
            </div>
            <div className="section2">
                <NavLink to="/about-me">
                    <h3>Meet the Dev!</h3>
                    <span>Learn more about the dev, <br/>Garrett Lackey by clicking here!</span>
                </NavLink>
            </div>
            <div className="section3">
                <NavLink to="/groups">
                    <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_group.png"/>
                    <h5 className="accent-color">See all groups &gt;</h5>
                    <span>Groups are where con fans unite to share events that members will love!<br/>Click here to see all groups.</span>
                </NavLink>
                <NavLink to="/events">
                    <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_ticket.webp"/>
                    <h5 className="accent-color">Find an event &gt;</h5>
                    <span>Conventions have great people and gregat experiences, whether its tournaments or shops: Click here to find your next con!</span>
                </NavLink>
                <NavLink 
                    className={sessionUser === null ? "disabled" : ""}
                    to={sessionUser != null ? "/groups/new" : ""}
                    >
                    <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/landing-page_host.jpg"/>
                    <h5 className="accent-color">Start a new group &gt;</h5>
                    <span>Do you have a con that needs to be seen by the world? Create a group to gain traction by Clicking here!</span>
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