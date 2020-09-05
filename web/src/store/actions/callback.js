
export function setCallback(visible, table, value) {
    return {
        type: 'SET_CALLBACK',
        visible,
        table,
        value,
    }
}