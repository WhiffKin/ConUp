import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAddGroup, thunkGetGroups } from "../../store/groups";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateGroup.css";

function CreateGroup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const { user } = useSelector(state => state.session)

    const [validation, setValidation] = useState({});
    const [errors, setErrors] = useState({});

    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [visibility, setVisibility] = useState("");
    const [imageURL, setImageURL] = useState("");

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

        // Validations
        const tempValid = {};
        const splitLocation = location.split(',');
        let city, state;
        if (splitLocation.length != 2) tempValid.location = "Location is required"
        else {
            city = splitLocation[0].trim();
            state = splitLocation[1].trim();
        }
        if ((!city || !state) && !tempValid.location) tempValid.location = "Location must be 'City, STATE'";
        else if (!tempValid.location && state.toUpperCase() !== state){console.log("HERE"); tempValid.location = "Location must be 'City, STATE'";}
        if (location === "") tempValid.location = "Name is required";
        if (name === "") tempValid.name = "Location is required";
        if (description.length < 30) tempValid.description = "Description must be at least 30 characters long";
        if (type === "") tempValid.type = "Group Type is required";
        if (visibility === "") tempValid.visibility = "Visibility Type is required";
        if (!checkEnds(imageURL)) tempValid.image = "Image URL must end in .png, .jpg, or .jpeg";
        setValidation(tempValid);
        setErrors({});

        // Unsuccessful Validation
        if (Object.values(tempValid).length != 0) return;

        // Successful Validation
        const payload = {
            organizerId: user.id,
            city, 
            state, 
            name, 
            about: description,
            type,
            private: visibility === "Private",
            imageURL,
        }
        const response = await dispatch(thunkAddGroup(payload, groupId));

        // Unsuccessful Submission
        if (response.message === "Bad Request") { 
            setErrors({
                message: response.message,
                errors: {...response.errors}
            });
            return;
        }
        else if (response.message) {
            setErrors({message: response.message});
            return;
        }

        // Successful Submission
        navigate(`/events/${response.id}`);
    }
    
    return (
    <>
        <form id="CreateGroupForm" onSubmit={onSubmit}>
            <div>
                <h5 className="green">BECOME AN ORGANIZER</h5>
                <h3>We&apos;ll walk you through a few steps to build your local community</h3>
            </div>
            <div>
                <h3>First, set your group&apos;s location.</h3>
                <label>
                    Meetup groups meet locally, in person and online. We&apos;ll connect you with people
                    <br/>in your area, and more can join you online.
                    <input 
                        placeholder="City, STATE" 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                    {validation.location && <p>{validation.location}</p>}
                </label>
            </div>
            <div>
                <h3>What will your group&apos;s name be?</h3>
                <label>
                    Choose a name that will give people a clear idea of what the group is about.
                    <br/>Feel free to get creative! You can edit this later if you change your mind.                    <input 
                        placeholder="What is your group name?" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    {validation.name && <p>Name is required</p>}
                </label>
            </div>
            <div>
                <h3>Now describe what your group will be about</h3>
                <label>
                    People will see this when we promote your group, but you&apos;ll be able to add to it later, too.
                    <br/>
                    <br/> 1.What&apos;s the purpose of the group?
                    <br/> 2. Who should join?
                    <br/> 3. What will you do at your events?
                    <textarea 
                        placeholder="Please write at least 30 characters" 
                        rows={10}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    {validation.description && <p>Description must be at least 30 characters long</p>}
                </label>
            </div>
            <div>
                <h3>Final steps...</h3>
                <label>
                    Is this an in person or online group?
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
                    Is this group private or public?
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
                    Please add in image url for your group below:
                    <input 
                        placeholder="Image URL" 
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        />
                    {validation.image && <p>Image URL must end in .png, .jpg, or .jpeg</p>}
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
            <button type="submit">Create Group</button>
        </form>
    </>
    )
}

export default CreateGroup;