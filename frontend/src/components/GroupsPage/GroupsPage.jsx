import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGroupsArr, thunkGetGroups } from "../../store/groups";

function GroupsPage() {
    const dispatch = useDispatch();
    const groups = useSelector(selectGroupsArr)

    useEffect(() => {
        dispatch(thunkGetGroups());
    }, [dispatch])

    return (
        <>
            {groups && groups.map(group => <h1 key={group.id}>{`group #${group.id}`}</h1>)}
        </>
    );
}

export default GroupsPage;