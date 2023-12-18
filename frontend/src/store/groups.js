import { createSelector } from "reselect";

// CUSTOM SELECTORS
export const selectGroupsArr = createSelector(
    state => state.groups,
    groups => Object.values(groups)
);

// ACTION CREATORS
const GET_GROUPS = "groups/getGroups";

const getGroups = (groups) => ({
    type: GET_GROUPS,
    payload: groups,
});

// THUNKS
export const thunkGetGroups = () => async (dispatch) => {
    const response = await fetch("/api/groups");

    if (response.ok) {
        const data = await response.json();
        dispatch(getGroups(data));
    }
}

// REDUCER
const initialState = { };

const groupReducer = (state = initialState, action) => {
    switch(action.type) {
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