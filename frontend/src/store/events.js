import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// CUSTOM SELECTORS
export const selectEventsArr = createSelector(
    state => state.events,
    events => Object.values(events)
);

// ACTION CREATORS
const GET_EVENTS = "events/getEvents";
const ADD_EVENT = "events/addEvent";

const getEvents = (events) => ({
    type: GET_EVENTS,
    payload: events,
});

const getEvent = (event) => ({
    type: ADD_EVENT,
    payload: event,
})

const addEvent = (event) => ({
    type: ADD_EVENT,
    payload: event,
})

// THUNKS
export const thunkGetEvents = () => async (dispatch) => {
    const response = await fetch("/api/events?" + new URLSearchParams({
        page: 1,
        size: 20,
    }));

    if (response.ok) {
        let data = await response.json();
        console.log("unsorted", data)
        data = data.sort((a,b) => Date.parse(a.startDate) < Date.parse(b.startDate) ? -1 : 1);
        console.log("sorted", data)
        dispatch(getEvents(data));
    }
}

export const thunkGetEventsById = (id) => async (dispatch) => {
    const response = await fetch(`/api/events/${id}`);

    const data = await response.json();
    if (response.ok) dispatch(getEvent(data));
    return data;
}

export const thunkAddEvent = (event, groupId) => async (dispatch) => {
    let response;
    try {
        response = await csrfFetch(`/api/groups/${groupId}/events/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event),
        });
    } catch(error) {
        return await error.json();
    }
    const data = await response.json();
    
    let image = {
        url: event.imageURL,
        preview: true,
    }
    try {
        response = await csrfFetch(`/api/events/${data.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image),
        });
    } catch (error) {
        return await error.json();
    }

    dispatch(addEvent(data));
    return data;
}

export const thunkUpdateEvent = (event, groupId) => {
    
}

// REDUCER
const initialState = { };

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_EVENT:
            return {...state, [action.payload.id]: action.payload};
        case GET_EVENTS: 
            return {...state, ...action.payload.reduce((events, event) =>{
                events[event.id] = event;
                return events;
            }, {})};
        default: 
            return state;
    }
}

export default eventReducer;