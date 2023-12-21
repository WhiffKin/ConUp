import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetEventsById } from "../../store/events";
import "./SingleEvent.css";
import { thunkGetGroupsById } from "../../store/groups";

function SingleEvent() {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const event = useSelector(state => state.events[eventId]);
    const group = useSelector(state => { if (event) return state.groups[event.groupId]; });
    
    useEffect(() => {
        dispatch(thunkGetEventsById(eventId));
    }, [dispatch, eventId])
    useEffect(() => {
        if (event)
        dispatch(thunkGetGroupsById(event.groupId));
    }, [dispatch, event])

    console.log(group);
    
    return (
        <>
            <header className="singleEventHeader">
                <span>{String.fromCharCode(60) /* < */} <NavLink to="/events">Events</NavLink></span>
                <h1>{event?.name}</h1>
                <h5>Hosted by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h5>
            </header>
            <main className="singleEventMain">
                <div>
                    <div>
                        <img src={event?.previewImage}/>
                        <div>
                            <NavLink to={`/groups/${group?.id}`} id="singleEvent__groupCard">
                                <img src={group?.previewImage} />
                                <div>
                                    <span>{group?.name}</span>
                                    <h5>{group?.private ? "Private" : "Public"}</h5>
                                </div>
                            </NavLink>
                            <div id="singleEvent__eventCard">
                                <div>
                                    <i className="fa-regular fa-clock" />
                                    <div>
                                        <div>
                                            <h5>START</h5>
                                            <h5>END</h5>
                                        </div>
                                        <div>
                                            <h5 className="green">{event?.startDate.split("T")[0]} {String.fromCharCode(183)} {event?.startDate.split("T")[1].split(".")[0]}</h5>
                                            <h5 className="green">{event?.endDate.split("T")[0]} {String.fromCharCode(183)} {event?.endDate.split("T")[1].split(".")[0]}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <i className="fa-solid fa-dollar-sign" />
                                    <h5>{typeof event?.price === "string" ? event?.price : event?.price?.toFixed(2)}</h5>
                                </div>
                                <div>
                                    <i className="fa-solid fa-map-pin" />
                                    <h5>{event?.type}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3>Details</h3>
                            <span>{event?.description}</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default SingleEvent;