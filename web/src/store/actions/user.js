
export function setUser(id, name, userType, hash) {
    return {
        type: 'SET_USER',
        id,
        name,
        userType,
        hash
    }
}