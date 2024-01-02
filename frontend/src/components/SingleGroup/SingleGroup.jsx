import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { thunkGetGroupsById } from "../../store/groups";
import "./SingleGroup.css";
import EventCard from "./EventCard";

function SingleGroup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId])
    const user = useSelector(state => state.session.user);
    const [currentImg, setCurrentImg] = useState(0);
    const imgContainerRef = useRef();
    
    useEffect(() => {
        dispatch(thunkGetGroupsById(groupId));
    }, [dispatch, groupId])
    
    const navigateFunc = (url) => () => {
        navigate(url);
    }

    const changeImg = (e) => {
        let newImg = e.nativeEvent.clientX 
                    - imgContainerRef.current.offsetLeft 
                    - imgContainerRef.current.width / 2;
        newImg = Math.round(newImg/300);
        newImg = Math.sign(newImg);
        newImg += currentImg;
        newImg += group?.GroupImages.length;

        if(group) setCurrentImg(newImg % group.GroupImages.length);
    }

    return (
        <>
            <header className="singleGroupHeader">
                <span>{String.fromCharCode(60) /* < */} <NavLink to="/groups">Groups</NavLink></span>
                <div>
                    <img 
                        src={group?.GroupImages && group.GroupImages[currentImg]?.url}
                        onMouseDown={changeImg}
                        ref={imgContainerRef}
                        />
                    <div>
                        <h3>{group?.name}</h3>
                        <h5>{group?.city}, {group?.state}</h5>
                        <h5>{group?.numEvents} event{group?.numEvents !== 1 ? "s":""} {String.fromCharCode(183) /* dot */} {group?.private ? "Private" : "Public"}</h5>
                        <h5>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h5>
                        {user && group && (user.id != group.organizerId ? 
                            <button onClick={() => window.alert("Feature coming soon")}>Join this group</button> 
                            :
                            <div id="singleGroupHeader_buttonContainer">
                                <button onClick={navigateFunc(`/groups/${groupId}/events/new`)}>Create event</button>
                                <button onClick={navigateFunc(`/groups/${groupId}/edit`)}>Update</button>
                                <button>Delete</button>
                            </div>)
                        }
                    </div>
                </div>
            </header>
            <main className="singleGroupMain">
                <div>
                    <div>
                        <h3>Organizer</h3>
                        <span>{group?.Organizer?.firstName} {group?.Organizer?.lastName}</span>
                    </div>
                    <div>
                        <h3>What we&apos;re about</h3>
                        <span>{group?.about}</span>
                    </div>
                    <div>
                        <h3>Upcoming Events ({group?.futureEvents?.length})</h3>
                        {group?.futureEvents?.length > 0 && group.futureEvents.map((event, id) => <EventCard key={id} event={event} location={({city: group.city, state: group.state})}/>)}
                    </div>
                    <div>
                        <h3>Past Events ({group?.pastEvents?.length})</h3>
                        {group?.pastEvents?.length > 0 && group.pastEvents.map((event, id) => <EventCard key={id} event={event} location={({city: group.city, state: group.state})}/>)}
                    </div>
                </div>
            </main>
        </>
    )
}

export default SingleGroup;