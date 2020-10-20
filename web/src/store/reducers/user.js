const INITIAL_STATE = {
    id: 0,
    name: '',
    hash: ''
}

export default function userValue(state = INITIAL_STATE, action) {
    if (action.type === 'SET_USER') {
        return {
            ...state, 
            id: action.id,
            name: action.name,
            hash: action.hash,
        }
    }
    return state;
}