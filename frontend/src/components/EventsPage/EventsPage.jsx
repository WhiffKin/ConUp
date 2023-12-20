import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "./EventCard";
import "./EventsPage.css";
import { NavLink } from "react-router-dom";
import { selectEventsArr, thunkGetEvents } from "../../store/events";

function EventsPage() {
    const dispatch = useDispatch();
    const events = useSelector(selectEventsArr)

    useEffect(() => {
        dispatch(thunkGetEvents());
    }, [dispatch])

    return (
        <>
            <header className="eventsHeader">
                <div>
                    <NavLink className="currentLink"><h3>Events</h3></NavLink>
                    <NavLink to="/groups"><h3>Groups</h3></NavLink>
                </div>
                <h5>Events in Meetup</h5>
            </header>
            <div className="eventCardContainer">
                {events && events.map(event => <EventCard event={event} key={event.id}/>)}
            </div>
        </>
    );
}

export default EventsPage;