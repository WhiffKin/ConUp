import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGroupNamesArr, thunkGetGroups } from "../../store/groups";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateEvent.css";
import { thunkAddEvent } from "../../store/events";

function CreateEvent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const group = useSelector(selectGroupNamesArr).find(group => group.id === +groupId);

    const [validation, setValidation] = useState({});
    const [errors, setErrors] = useState({});
    
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [visibility, setVisibility] = useState("");
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [description, setDescription] = useState("");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        dispatch(thunkGetGroups());
    }, [dispatch]);

    const checkEnds = (string) => {
        return string.endsWith(".png") || 
               string.endsWith(".jpg") || 
               string.endsWith(".jpeg");
    }  

    const onSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);

        // Validations
        const tempValid = {};
        if (name === "") tempValid.name = "Name is required";
        if (type === "") tempValid.type = "Event type is required";
        if (visibility === "") tempValid.visibility = "Visibility is required";
        if (price === "") tempValid.price = "Price is required";
        if (capacity === "") tempValid.capacity = "Capacity is required";
        if (startDate === "") tempValid.startDate = "Event start is required";
        if (endDate === "") tempValid.endDate = "Event end is required";
        if (!checkEnds(imageURL)) tempValid.imageURL = "Image URL must end in .png, .jpg, or .jpeg";
        if (description.length < 30) tempValid.description = "Description must be at least 30 characters long";
        setValidation(tempValid);
        setErrors({});

        // Unsuccessful Validation
        if (Object.values(tempValid).length != 0) {
            setDisabled(false);
            return;
        }

        // Successful Validation
        const payload = {
            name, 
            type,
            visibility,
            price,
            capacity,
            startDate,
            endDate,
            imageURL,
            description,
        }
        const response = await dispatch(thunkAddEvent(payload, groupId));

        // Unsuccessful Submission
        if (response.message === "Bad Request") { 
            setErrors({
                message: response.message,
                errors: {...response.errors}
            });
            setDisabled(false);
            return;
        }
        else if (response.message) {
            setErrors({message: response.message});
            setDisabled(false);
            return;
        }

        // Successful Submission
        navigate(`/events/${response.id}`);
    }
    
    return (
    <>
        <form id="CreateEventForm" onSubmit={onSubmit}>
            <div>
                <h1>{`Create an event for ${group?.name}`}</h1>
                <label>
                    What is the name of your event?
                    <input 
                        placeholder="Event Name" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    {validation.name && <p>Name is required</p>}
                </label>
            </div>
            <div>
                <label>
                    Is this an in person or online event?
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        >
                        <option hidden defaultValue>{"(select one)"}</option>
                        <option value="Online">Online</option>
                        <option value="In person">In person</option>
                    </select>
                    {validation.type && <p>Event type is required</p>}
                </label>
                <label>
                    Is this event private or public?
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        >
                        <option hidden defaultValue>{"(select one)"}</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>
                    {validation.visibility && <p>Visibility is required</p>}
                </label>
                <label>
                    What is the price for your event?
                    <input 
                        className="price" 
                        placeholder="0" 
                        type="number" 
                        min={0}
                        step={.01}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        />
                    {validation.price && <p>Price is required</p>}
                </label>
                <label>
                    How many people can attend your event?
                    <input 
                        placeholder="1" 
                        type="number" 
                        min={1}
                        step={1}
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        />
                    {validation.capacity && <p>Capacity is required</p>}
                </label>
            </div>
            <div>
                <label>
                    When does your event start? 
                    <input 
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        />
                    {validation.startDate && <p>Event start is required</p>}
                </label>
                <label>
                    When does your event end? 
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        />
                    {validation.endDate && <p>Event end is required</p>}
                </label>
            </div>
            <div>
                <label>
                    Please add in image url for your event below:
                    <input 
                        placeholder="Image URL" 
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        />
                    {validation.imageURL && <p>Image URL must end in .png, .jpg, or .jpeg</p>}
                </label>
            </div>
            <div>
                <label>
                    Please describe your event:
                    <textarea 
                        placeholder="Please include at least 30 characters" 
                        rows={10}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    {validation.description && <p>Description must be at least 30 characters long</p>}
                </label>
            </div>
            {errors.message && 
                <div className="errorDiv">
                    <>
                        <h3>{errors.message}</h3>
                        {errors.errors && Object.values(errors.errors).map((error, errorId) => <p key={errorId}>{error}</p>)}
                    </>
                </div>
            }
            <button type="submit" disabled={disabled}>Create Event</button>
        </form>
    </>
    )
}

export default CreateEvent;