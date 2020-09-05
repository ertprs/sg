const INITIAL_STATE = {
    visible:  false,
    table: '',
    value: ''
}

export default function callBackValue(state = INITIAL_STATE, action) {
    if (action.type === 'SET_CALLBACK') {
        return {
            ...state, 
            visible: action.visible,
            value: action.value,
            table: action.table
        }
    }
    return state;
}