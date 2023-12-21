import { createSelector } from "reselect";

// CUSTOM SELECTORS
export const selectGroupsArr = createSelector(
    state => state.groups,
    groups => Object.values(groups)
);

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

// THUNKS
export const thunkGetGroups = () => async (dispatch) => {
    const response = await fetch("/api/groups");

    if (response.ok) {
        const data = await response.json();
        dispatch(getGroups(data));
    }
}

export const thunkGetGroupsById = (id) => async (dispatch) => {
    if (id === undefined) return { message: "A groups id cannot be undefined."};
    const response = await fetch(`/api/groups/${id}`);

    const data = await response.json();
    if (response.ok) dispatch(getGroupById(data));
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