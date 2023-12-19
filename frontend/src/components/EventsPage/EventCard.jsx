import { NavLink } from "react-router-dom";
import "./EventCard.css";

function GroupCard({ event }) {
    return (
        <NavLink className="EventCard" to={`/events/${event.id}`}>
            <div>
                <img src={event.previewImage}/>
                <div>
                    <h3>{event.startDate.split("T")[0]} {String.fromCharCode(183)} {event.startDate.split("T")[1].split(".")[0]}</h3>
                    <h1>{event.name}</h1>
                    <h5>{event.type === "Online" ? "Online" : `${event.city}, ${event.state}`}</h5>
                </div>
            </div>
            <h5>{event.description}</h5>
        </NavLink>
    )
}

export default GroupCard;