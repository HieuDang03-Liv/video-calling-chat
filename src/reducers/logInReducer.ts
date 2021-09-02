const initialState = {
    displayName: '',
    avatarURL: '',
    email: '',
}

const logInReducer = (state:any=initialState, action:any) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                displayName: action.payload.displayName,
                avatarURL: action.payload.avatarURL,
                email: action.payload.email,
            }
        case 'LOG_OUT':
            return {
                displayName: null,
                avatarURL: null,
                email: null,
            }
        default:
            return state
    }
}

export default logInReducer