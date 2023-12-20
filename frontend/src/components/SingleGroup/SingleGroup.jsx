import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetGroupsById } from "../../store/groups";
import "./SingleGroup.css";

function SingleGroup() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId])
    
    useEffect(() => {
        dispatch(thunkGetGroupsById(groupId));
    }, [dispatch, groupId])

    console.log(group);
    
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
                        <button>Join this group</button>
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