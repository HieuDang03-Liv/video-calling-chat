import LoginPage from "./components/LoginPage"
import { BrowserRouter as Router } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import HomePage from "./components/HomePage"
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './reducers'


function App() {
  const modePage = useAppSelector(state => state.modePage)
  const isLogedIn = useAppSelector(state => state.isLogedIn)
  const theme = createTheme({
    palette: {
      primary: {
        light: '#0C11F2',
        dark: '#00C2FF',
        main: '#0C8AF2'
      },
      secondary: {
        light: '#DEE0E2',
        dark: 'rgba(57, 57, 63, 0.6)',
        main: '#C0ACAC'
      },
      error: {
        light: '#FE0000',
        dark: '#FD2727',
        main: '#E72E15'
      },
      info: {
        main: 'rgba(63, 118, 226, 0.21)',
      },
      type: modePage ? 'dark' : 'light'
    },
    typography: {
      fontSize: 16,
      fontFamily: 'Dancing Script',
      subtitle1: {
        fontWeight: 600
      },
      subtitle2: {
        color: '#C0ACAC'
      }
    },
  })
  return (
    <Router>
        <ThemeProvider theme={theme}>
          {
            isLogedIn.email ? (
                <HomePage />
            ) : (
                <LoginPage />
            )
          }        
        </ThemeProvider>
    </Router>
  )
}

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default App
