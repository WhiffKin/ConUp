import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// CUSTOM SELECTORS
export const selectEventsArr = createSelector(
    state => state.events,
    events => Object.values(events.allEvents)
                    .sort(sortDates)
);
export const selectMyEventsArr = createSelector(
    state => state.events,
    events => Object.values(events.userEvents)
                    .sort(sortDates)
);

const sortDates = (a,b) => {
    const first = new Date(a.startDate.split(".")[0].split("T").join(" "));
    const second = new Date(b.startDate.split(".")[0].split("T").join(" "));

    if (first < Date.now() && second < Date.now()) return second - first;
    if (first < Date.now()) return 1;
    if (second < Date.now()) return -1;
    return first - second;
};

// ACTION CREATORS
const GET_EVENTS = "events/getEvents";
const ADD_EVENT = "events/addEvent";
const DELETE_EVENT = "events/deleteEvent";
const DELETE_EVENTS_BY_GROUP = "events/deleteEventsByGroup";

const getEvents = (allEvents, userEvents) => ({
    type: GET_EVENTS,
    payload: {
        allEvents, userEvents
    },
});

const getEvent = (event) => ({
    type: ADD_EVENT,
    payload: event,
})

const addEvent = (event) => ({
    type: ADD_EVENT,
    payload: event,
})

const deleteEvent = (eventId) => ({
    type: DELETE_EVENT,
    payload: eventId,
})

export const deleteEventsByGroup = (groupId) => ({
    type: DELETE_EVENTS_BY_GROUP,
    payload: groupId,
})

// THUNKS
export const thunkGetEvents = () => async (dispatch) => {
    const responseAllEvents = await fetch("/api/events?" + new URLSearchParams({
        page: 1,
        size: 20,
    }));
    
    let responseUserEvents;
    try {
        responseUserEvents = await csrfFetch(`/api/events/current`);
    } catch (e) { responseUserEvents = null; } 

    const dataAllEvents = await responseAllEvents.json();
    let dataUserEvents;
    if (responseUserEvents) dataUserEvents = await responseUserEvents.json();

    const payload = {
        allEvents: [],
        userEvents: [],
    }
    if (responseAllEvents.ok) payload.allEvents = dataAllEvents;
    if (responseUserEvents?.ok) payload.userEvents = dataUserEvents;

    dispatch(getEvents(payload.allEvents, payload.userEvents))
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

export const thunkUpdateEvent = (event, eventId) => async (dispatch) => {
    let response;
    try {
        response = await csrfFetch(`/api/events/${eventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event),
        });
    } catch(error) {
        return await error.json();
    }
    
    const data = await response.json();
    dispatch(addEvent(data));
    return data;    
}

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
    let response;
    try {
        response = await csrfFetch(`/api/events/${eventId}`, {
            method: "DELETE"
        });
    } catch(error) {
        return await error.json();
    }
    
    const data = await response.json();
    dispatch(deleteEvent(eventId));
    return data;    
}

// REDUCER
const initialState = {
    allEvents: {},
    userEvents: {},
 };

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case DELETE_EVENT: {
            const newState = {
                allEvents: {...state.allEvents}, 
                userEvents: {...state.userEvents}
            };

            const id = action.payload;
            if (newState.allEvents[id]) delete newState.allEvents[id];
            if (newState.userEvents[id]) delete newState.userEvents[id];

            return newState;
        } 
        case DELETE_EVENTS_BY_GROUP: {
            const newState = {
                allEvents: {...state.allEvents}, 
                userEvents: {...state.userEvents}
            };

            Object.keys(newState.allEvents).forEach(id => {
                if (newState.allEvents[id].groupId == action.payload)
                    delete newState.allEvents[id];
            });
            Object.keys(newState.userEvents).forEach(id => {
                if (newState.userEvents[id].groupId == action.payload)
                    delete newState.userEvents[id];
            });

            return newState;
        }
        case ADD_EVENT:
            return {
                allEvents: {...state.allEvents, [action.payload.id]: action.payload}, 
                userEvents: {...state.userEvents}
            };
        case GET_EVENTS: 
            return {
                ...state, 
                allEvents: {...action.payload.allEvents.reduce((events, event) => {
                    events[event.id] = event;
                    return events;
                }, {})},
                userEvents: {...action.payload.userEvents.reduce((events, event) => {
                    events[event.id] = event;
                    return events;
                }, {})}
            };
        default: 
            return state;
    }
}

export default eventReducer;