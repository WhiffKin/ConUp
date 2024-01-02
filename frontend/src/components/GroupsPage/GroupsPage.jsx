import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGroupsArr, thunkGetGroups } from "../../store/groups";
import GroupCard from "./GroupCard";
import "./GroupsPage.css";
import { NavLink } from "react-router-dom";

function GroupsPage() {
    const dispatch = useDispatch();
    const groups = useSelector(selectGroupsArr);

    useEffect(() => {
        dispatch(thunkGetGroups());
    }, [dispatch])

    return (
        <>
            <header className="groupsHeader">
                <div>
                    <NavLink to="/events"><h3>Events</h3></NavLink>
                    <NavLink className="currentLink"><h3>Groups</h3></NavLink>
                </div>
                <h5>Groups in Meetup</h5>
            </header>
            <div className="groupCardContainer">
                {groups && groups.map(group => <GroupCard group={group} key={group.id}/>)}
            </div>
        </>
    );
}

export default GroupsPage;