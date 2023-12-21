import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGroupNamesArr, thunkGetGroups } from "../../store/groups";
import { useParams } from "react-router-dom";
import "./CreateEvent.css";

function CreateEvent() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(selectGroupNamesArr).find(group => group.id === +groupId);
    const [validation, setValidation] = useState({})

    useEffect(() => {
        dispatch(thunkGetGroups());
    }, [dispatch])

    return (
    <>
        <form id="CreateEventForm">
            <div>
                <h1>{`Create an event for ${group?.name}`}</h1>
                <label>
                    What is the name of your event?
                    <input placeholder="Event Name" type="text"/>
                </label>
            </div>
            <div>
                <label>
                    Is this an in person or online event?
                    <select>
                        <option hidden selected>{"(select one)"}</option>
                        <option value="Online">Online</option>
                        <option value="In Person">In Person</option>
                    </select>
                </label>
                <label>
                    Is this event private or public?
                    <select>
                        <option hidden selected>{"(select one)"}</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>
                </label>
                <label>
                    What is the price for your event?
                    <input className="price" placeholder="0" type="number" step={.01}/>
                </label>
            </div>
            <div>
                <label>
                    When does your event start? 
                    <input type="datetime-local"/>
                </label>
                <label>
                    When does your event end? 
                    <input type="datetime-local"/>
                </label>
            </div>
            <div>
                <label>
                    Please add in image url for your event below:
                    <input placeholder="Image URL" type="text"/>
                </label>
            </div>
            <div>
                <label>
                    Please describe your event:
                    <textarea placeholder="Please include at least 30 characters" rows={10}/>
                </label>
            </div>
            <button disabled={Object.values(validation).length != 0} type="submit">Create Event</button>
        </form>
    </>
    )
}

export default CreateEvent;