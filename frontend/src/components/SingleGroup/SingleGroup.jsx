import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetGroupsById } from "../../store/groups";

function SingleGroup() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId])
    
    useEffect(() => {
        dispatch(thunkGetGroupsById(groupId));
    }, [dispatch])
    
    return (
        <>
        {group && (<h1>{group.name}</h1>)}
        </>
    )
}

export default SingleGroup;