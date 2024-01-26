import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../EventsPage/EventCard";
import { NavLink, useNavigate } from "react-router-dom";
import { selectMyEventsArr, thunkGetEvents } from "../../store/events";

function MyEventsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const events = useSelector(selectMyEventsArr)
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetEvents());
    }, [dispatch])

    if (sessionUser === null) navigate('/'); 

    // This element relies on styling imported in src/components/EventsPage
    return (
        <>
            <header className="eventsHeader">
                <div>
                    <NavLink className="currentLink"><h3 className="accent-color">My Events</h3></NavLink>
                    <NavLink to="/my-groups"><h3>My Groups</h3></NavLink>
                </div>
                <h5>My Events in Meetup</h5>
            </header>
            <div className="eventCardContainer">
                {events && events.map(event => <EventCard event={event} isMyEvent={true} key={event.id}/>)}
            </div>
        </>
    );
}

export default MyEventsPage;