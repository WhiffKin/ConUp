import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { thunkGetEventsById } from "../../store/events";
import { thunkGetGroupsById } from "../../store/groups";
import "./SingleEvent.css"; 
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteEventModal from "../DeleteEventModal";

function SingleEvent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { eventId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const event = useSelector(state => state.events[eventId]);
    const group = useSelector(state => { if (event) return state.groups[event.groupId]; });
    const [currentImg, setCurrentImg] = useState(0);
    const imgContainerRef = useRef();

    useEffect(() => {
        dispatch(thunkGetEventsById(eventId));
    }, [dispatch, eventId])
    useEffect(() => {
        if (event)
            dispatch(thunkGetGroupsById(event.groupId));
    }, [dispatch, event])

    const changeImg = (e) => {
        let newImg = e.nativeEvent.clientX 
                    - imgContainerRef.current.offsetLeft 
                    - imgContainerRef.current.width / 2;
        newImg = Math.round(newImg/300);
        newImg = Math.sign(newImg);
        newImg += currentImg;
        newImg += group?.GroupImages.length;

        if(event) setCurrentImg(newImg % event.EventImages.length);
    }

    const updateEvent = () => {
        navigate(`/events/${eventId}/edit`)
    }

    return (
        <>
            <header className="singleEventHeader">
                <span>{String.fromCharCode(60) /* < */} <NavLink to="/events">Events</NavLink></span>
                <h1>{event?.name}</h1>
                <h5>Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h5>
            </header>
            <main className="singleEventMain">
                <div>
                    <div>
                        <img 
                            src={event?.EventImages && event.EventImages[currentImg]?.url}
                            onMouseDown={changeImg}
                            ref={imgContainerRef}
                            />
                        <div>
                            <NavLink to={`/groups/${group?.id}`} id="singleEvent__groupCard">
                                <img src={group?.previewImage?.url} />
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
                                    <h5>{+event?.price === 0 ? "FREE" : `${(+event?.price).toFixed(2)}$`}</h5>
                                </div>
                                <div>
                                    <i className="fa-solid fa-map-pin" />
                                    <h5>{event?.type}</h5>
                                    {sessionUser.id === group?.organizerId &&
                                    <div id="singleEvent__eventCard-buttonContainer">
                                        <button onClick={updateEvent}>Update</button>
                                        <button>
                                            <OpenModalMenuItem
                                                itemText="Delete"
                                                modalComponent={<DeleteEventModal eventId={eventId} groupId={event.groupId} navigate={navigate}/>}
                                                />
                                        </button>
                                    </div>}
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
