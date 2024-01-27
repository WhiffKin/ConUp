import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteEvent } from "../../store/events";
import "./DeleteEvent.css";

function DeleteEventModal({ eventId, groupId, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteEvent = async (e) => {
        e.preventDefault();
        await dispatch(thunkDeleteEvent(eventId));
        navigate(`/groups/${groupId}`);
        closeModal();
    }

    const keepEvent = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <>
            <form className="DeleteForm">
                <h1>Confirm Delete</h1>
                <h3>Are you sure you want to delete this event?</h3>
                <button onClick={deleteEvent}>Yes (Delete Event)</button>
                <button onClick={keepEvent}>No (Keep Event)</button>
            </form>
        </>
    )
}

export default DeleteEventModal;