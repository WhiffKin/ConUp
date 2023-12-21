import { createSelector } from "reselect";

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

const getEventById = (event) => ({
    type: ADD_EVENT,
    payload: event,
})

// THUNKS
export const thunkGetEvents = () => async (dispatch) => {
    const response = await fetch("/api/events?" + new URLSearchParams({
        page: 1,
        size: 5,
    }));

    if (response.ok) {
        const data = await response.json();
        dispatch(getEvents(data));
    }
}

export const thunkGetEventsById = (id) => async (dispatch) => {
    const response = await fetch(`/api/events/${id}`);

    const data = await response.json();
    if (response.ok) dispatch(getEventById(data));
    return data;
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