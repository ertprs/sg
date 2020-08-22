const INITIAL_STATE = {
    visible: false
}

export default function loading(state = INITIAL_STATE, action) {
    if (action.type === 'SET_LOADING') {
        return {
            ...state, 
            visible: action.visible,
        }
    }
    return state;
}