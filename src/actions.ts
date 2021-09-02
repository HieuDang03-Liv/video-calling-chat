export const darkMode = () => {
    return {
        type: 'DARK_MODE'
    }
}
export const lightMode = () => {
    return {
        type: 'LIGHT_MODE'
    }
}

export const logIn = (payload:any) => {
    return {
        type: 'LOG_IN',
        payload: payload
    }
}
export const logOut = () => {
    return {
        type: 'LOG_OUT'
    }
}