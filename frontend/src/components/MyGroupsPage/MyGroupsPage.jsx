import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMyGroupsArr, thunkGetGroups } from "../../store/groups";
import GroupCard from "../GroupsPage/GroupCard";
import { NavLink, useNavigate } from "react-router-dom";

function MyGroupsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const groups = useSelector(selectMyGroupsArr);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetGroups());
    }, [dispatch])

    if (sessionUser === null) navigate('/'); 

    // This element relies on styling imported in src/components/GroupsPage
    return (
        <>
            <header className="groupsHeader">
                <div>
                    <NavLink to="/my-events"><h3>My Events</h3></NavLink>
                    <NavLink className="currentLink"><h3>My Groups</h3></NavLink>
                </div>
                <h5>My Groups in Meetup</h5>
            </header>
            <div className="groupCardContainer">
                {groups && groups.map(group => <GroupCard group={group} key={group.id}/>)}
            </div>
        </>
    );
}

export default MyGroupsPage;