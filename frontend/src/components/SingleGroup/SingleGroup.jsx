import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetGroupsById } from "../../store/groups";
import "./SingleGroup.css";

function SingleGroup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId])
    const user = useSelector(state => state.session.user);
    
    useEffect(() => {
        dispatch(thunkGetGroupsById(groupId));
    }, [dispatch, groupId])
    
    const navigateFunc = (url) => () => {
        navigate(url);
    }

    return (
        <>
            <header className="singleGroupHeader">
                <span>{String.fromCharCode(60) /* < */} <NavLink to="/groups">Groups</NavLink></span>
                <div>
                    <img src={group?.previewImage}/>
                    <div>
                        <h3>{group?.name}</h3>
                        <h5>{group?.city}, {group?.state}</h5>
                        <h5>## events {String.fromCharCode(183) /* dot */} {group?.private ? "Private" : "Public"}</h5>
                        <h5>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h5>
                        {user && group && (user.id != group.organizerId ? 
                            <button onClick={() => window.alert("Feature coming soon")}>Join this group</button> 
                            :
                            <div id="singleGroupHeader_buttonContainer">
                                <button onClick={navigateFunc(`/groups/${groupId}/events/new`)}>Create event</button>
                                <button>Update</button>
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

export default SingleGroup;