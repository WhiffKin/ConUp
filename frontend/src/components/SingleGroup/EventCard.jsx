import { NavLink } from "react-router-dom";

function EventCard({ event, location }) {
    return (
        <NavLink to={`/events/${event.id}`} className="eventCard">
            <div>
                <img src={event.previewImage}/>
                <div>
                    <h5 className="green">{event?.startDate.split("T")[0]} {String.fromCharCode(183)} {event?.startDate.split("T")[1].split(".")[0]}</h5>
                    <h3>{event.name}</h3>
                    <h5>{event.type === "Online" ? "Online" : `${location.city}, ${location.state}`}</h5>
                </div>
            </div>
            <span>{event.description}</span>
        </NavLink>
    )
}

export default EventCard;