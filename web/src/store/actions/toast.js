export function setToast (visible, style, message) {
    return {
        type: 'SET_TOAST',
        visible,
        style,
        message
    }
}