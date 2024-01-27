import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteGroup } from "../../store/groups";
import "./DeleteGroup.css";

function DeleteGroupModal({ groupId, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteGroup = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteGroup(groupId));
        navigate("/groups");
        closeModal();
    }

    const keepGroup = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <>
            <form className="DeleteForm">
                <h1>Confirm Delete</h1>
                <h3>Are you sure you want to delete this group?</h3>
                <button onClick={deleteGroup}>Yes (Delete Group)</button>
                <button onClick={keepGroup}>No (Keep Group)</button>
            </form>
        </>
    )
}

export default DeleteGroupModal;