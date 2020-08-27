const INITIAL_STATE = {
    visible: false,
    style: '',
    message: ''
}

export default function loading(state = INITIAL_STATE, action) {
    if (action.type === 'SET_TOAST') {
        return {
            ...state, 
            visible: action.visible,
            style: action.type,
            message: action.message
        }
    }
    return state;
}