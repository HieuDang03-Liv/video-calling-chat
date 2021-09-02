let initialState = false

const modePageReducer = (state=initialState, action:any) => {
    switch (action.type) {
        case 'DARK_MODE':
            return state=true
        case 'LIGHT_MODE':
            return state=false
        default:
            return state
    }
}

export default modePageReducer