
export function setUser(id, name, hash) {
    return {
        type: 'SET_USER',
        id,
        name,
        hash
    }
}