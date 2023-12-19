import { NavLink } from "react-router-dom";
import "./GroupCard.css";

function GroupCard({ group }) {
    return (
        <NavLink className="GroupCard" to={`/groups/${group.id}`}>
            <img src={group.previewImage}/>
            <div>
                <h3>{group.name}</h3>
                <h5>{group.city}, {group.state}</h5>
                <span>{group.about}</span>
                <h5>##events • {group.private ? "Private" : "Public"}</h5>
            </div>
        </NavLink>
    )
}

export default GroupCard;