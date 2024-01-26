import { NavLink } from "react-router-dom";
import "./EventCard.css";

function EventCard({ event }) {
    return (
        <NavLink className="EventCard" to={`/events/${event.id}`}>
            <div>
                <img src={event.previewImage}/>
                <div>
                    <h3 className="accent-color">{event.startDate.split("T")[0]} {String.fromCharCode(183) /* · */} {event.startDate.split("T")[1].split(".")[0]}</h3>
                    <h1>{event.name}</h1>
                    <h5 className="accent-color">{event.type === "Online" ? "Online" : `${event.Venue?.city}, ${event.Venue?.state}`}</h5>
                </div>
            </div>
            <span>{event.description}</span>
        </NavLink>
    )
}

export default EventCard;