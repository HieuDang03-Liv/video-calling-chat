import { configureStore } from '@reduxjs/toolkit'
import logInReducer from './logInReducer'
import modePageReducer from './modePageReducer'

const store = configureStore({
    reducer: {
        modePage: modePageReducer,
        isLogedIn: logInReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export default store