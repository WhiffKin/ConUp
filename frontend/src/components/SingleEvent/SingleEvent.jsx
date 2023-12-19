import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetEventsById } from "../../store/events";
import "./SingleEvent.css";

function SingleEvent() {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const event = useSelector(state => state.events[eventId])
    
    useEffect(() => {
        dispatch(thunkGetEventsById(eventId));
    }, [dispatch, eventId])

    console.log(event);
    
    return (
        <>
            <header className="singleEventHeader">
                <span>{String.fromCharCode(60) /* < */} <NavLink to="/events">Events</NavLink></span>
                <div>
                    <img src={event?.previewImage}/>
                    <div>
                        <h3>{event?.name}</h3>
                        <h5>{event?.city}, {event?.state}</h5>
                        <h5>## events {String.fromCharCode(183) /* dot */} {event?.private ? "Private" : "Public"}</h5>
                        <h5>Organized by {event?.Organizer?.firstName} {event?.Organizer?.lastName}</h5>
                        <button>Join this event</button>
                    </div>
                </div>
            </header>
            <main className="singleEventMain">
                <div>
                    <div>
                        <h3>Organizer</h3>
                        <span>{event?.Organizer?.firstName} {event?.Organizer?.lastName}</span>
                    </div>
                    <div>
                        <h3>What we&apos;re about</h3>
                        <span>{event?.about}</span>
                    </div>
                    <div>
                        <h3>Upcoming Events</h3>
                    </div>
                    <div>
                        <h3>Past Events</h3>
                    </div>
                </div>
            </main>
        </>
    )
}

export default SingleEvent;