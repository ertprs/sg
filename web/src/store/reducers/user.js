const INITIAL_STATE = {
    id: 0,
    name: '',
    userType: -1,
    hash: ''
}

export default function userValue(state = INITIAL_STATE, action) {
    if (action.type === 'SET_USER') {
        return {
            ...state, 
            id: action.id,
            name: action.name,
            userType: action.userType,
            hash: action.hash,
        }
    }
    return state;
}