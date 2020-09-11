const INITIAL_STATE = {
    id: 0,
    name: ''
}

export default function userValue(state = INITIAL_STATE, action) {
    if (action.type === 'SET_USER') {
        return {
            ...state, 
            id: action.id,
            name: action.name
        }
    }
    return state;
}