import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// CUSTOM SELECTORS
export const selectGroupsArr = createSelector(
    state => state.groups,
    groups => Object.values(groups)
);

export const selectGroupNamesArr = createSelector(
    state => state.groups,
    groups => Object.values(groups).map(group => ({name: group.name, id: group.id}))
)

// ACTION CREATORS
const GET_GROUPS = "groups/getGroups";
const ADD_GROUP = "groups/addGroup";

const getGroups = (groups) => ({
    type: GET_GROUPS,
    payload: groups,
});

const getGroupById = (group) => ({
    type: ADD_GROUP,
    payload: group,
})

const addGroup = (group) => ({
    type: ADD_GROUP,
    payload: group,
})

// THUNKS
export const thunkGetGroups = () => async (dispatch) => {
    const groupResponse = await fetch("/api/groups");
    const eventResponse = await fetch("/api/events?size=0");

    if (groupResponse.ok && eventResponse.ok) {
        const groupData = await groupResponse.json();
        const eventData = await eventResponse.json();
        
        const groupMap = {};
        for (let event of eventData) 
            if (groupMap[event.groupId]) groupMap[event.groupId]++;
            else groupMap[event.groupId] = 1;

        for (let group of groupData)
            if (groupMap[group.id]) group.numEvents = groupMap[group.id];
            else group.numEvents = 0;

        dispatch(getGroups(groupData));
    }
}

export const thunkGetGroupsById = (id) => async (dispatch) => {
    if (id === undefined) return { message: "A groups id cannot be undefined."};
    const response = await fetch(`/api/groups/${id}`);
    const eventResponse = await fetch("/api/events?size=0");
    
    const data = await response.json();
    if (response.ok && eventResponse.ok) { 
        let eventData = await eventResponse.json();
        
        eventData = eventData.filter(event => event.groupId === +id);
        const pastEvents = [];
        const futureEvents = [];
        eventData.forEach(event => {
            if (Date.parse(event.startDate) < Date.now()) pastEvents.push(event);
            else futureEvents.push(event);
        })
        data.numEvents = eventData.length;
        data.pastEvents = pastEvents
        .sort((a,b) => Date.parse(a.startDate) < Date.parse(b.startDate) ? -1 : 1);
        data.futureEvents = futureEvents
        .sort((a,b) => Date.parse(a.startDate) < Date.parse(b.startDate) ? -1 : 1);
    
        dispatch(getGroupById(data));
    }
    return data;
}

export const thunkAddGroup = (group) => async (dispatch) => {
    let response;
    try {
        response = await csrfFetch(`/api/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(group),
        });
    } catch (error) {
        return await error.json();
    }
    const data = await response.json();
    
    let image = {
        url: group.imageURL,
        preview: true,
    }
    try {
        response = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image),
        });
    } catch (error) {
        return await error.json();
    }

    dispatch(addGroup(data));
    return data;
}

// REDUCER
const initialState = { };

const groupReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_GROUP:
            return {...state, [action.payload.id]: action.payload};
        case GET_GROUPS: 
            return {...state, ...action.payload.reduce((groups, group) =>{
                groups[group.id] = group;
                return groups;
            }, {})};
        default: 
            return state;
    }
}

export default groupReducer;