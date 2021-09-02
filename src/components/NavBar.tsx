import { useState } from 'react'
import { Avatar, BottomNavigation, BottomNavigationAction, Badge, Button, Typography, Switch } from "@material-ui/core"
import { Email, ExitToApp, Person } from "@material-ui/icons"
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Link, useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../App'
import { darkMode, lightMode, logOut } from '../actions'
import { auth } from '../firebase'

const useStyles = makeStyles((theme: Theme) => createStyles({
    navBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'row',
            height: '10vh',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'column',
            height: '100vh',
        }
    },
    twoMainTab: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'row'
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'column'
        }
    },
    textLink: {
        alignSelf: 'center',
        textDecoration: 'none',
        fontStyle: 'none',
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.h4.fontSize,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.h2.fontSize,
        }
    },
    mainLink: {
        '&:focus': {
            color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            backgroundColor: theme.palette.info.main,
            [theme.breakpoints.down('md')]: {
                border: 'none',
                borderBottom: '5px solid',
                borderBottomColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            },
            [theme.breakpoints.up('md')]: {
                border: 'none',
                borderRight: '10px solid',
                borderRightColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            }
        }
    },
    icon: {
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.fontSize * 2
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.fontSize * 3
        }
    },
    darkModeP: {
        fontSize: 16,
        textTransform: 'lowercase',
        color: theme.palette.type === 'light' ? '#000' : '#fff'
    },
    darkMode: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.secondary.light : theme.palette.secondary.dark,
        borderRadius: 4,
        width: '150%'
    },
    hidden: {
        display: 'none'
    },
    notHidden: {
        position: 'absolute',
        top: '-200%',
        left: '-50%'
    },
    avatarBtn: {
        position: 'relative'
    },
    logOutIcon: {
        fontSize: 16,
        color: theme.palette.type === 'light' ? '#000' : '#fff'
    }
}))


const NavBar = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const history = useHistory()
    const [state, setState] = useState({
        checkedA: false,
    })
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked })
        if (event.target.checked) {
            dispatch(darkMode())
        } else {
            dispatch(lightMode())
        }
    }
    
    const [hidden, setHidden] = useState(true)
    const logout = () => {
        auth.signOut()
            .then(() => {
                dispatch(logOut())
            })
            .then(() => {
                history.push('/')
            })
    }

    return (
        <BottomNavigation className={classes.navBar}>
            <Link to='/' className={classes.textLink}>
                chat.
            </Link>
            <div className={classes.twoMainTab}>
                <Link to='/messages'>
                    <BottomNavigationAction icon={<Email className={classes.icon} />} className={classes.mainLink}/> 
                </Link>
                <Link to='/profile'>
                    <BottomNavigationAction icon={<Person className={classes.icon} />} className={classes.mainLink}/> 
                </Link>
            </div>
            <Button className={classes.avatarBtn} onClick={() => setHidden(pre => !pre)} >
                <div className={hidden ? classes.hidden : classes.notHidden}>
                    <div className={classes.darkMode}>
                        <Typography className={classes.darkModeP}>Dark mode</Typography>
                        <Switch  
                            color='primary'
                            onChange={handleChange}
                            checked={state.checkedA}
                            name="checkedA"
                            />
                    </div>
                    <Button onClick={logout} className={classes.darkMode} variant='contained' color='secondary' startIcon={<ExitToApp className={classes.logOutIcon} />}>
                        <Typography className={classes.darkModeP}>Logout</Typography>
                    </Button>
                </div>
                <Badge variant='dot' color='primary'>
                    <Avatar alt='avatar' src={isLogedIn.avatarURL} />
                </Badge>
            </Button>
        </BottomNavigation>
    )
}

export default NavBar
