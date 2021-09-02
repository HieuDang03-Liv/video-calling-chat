import { useState } from 'react'
import bg1 from '../images/bg1.png'
import { Button, Grid, Typography } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Input, InputAdornment, InputLabel } from '@material-ui/core'
import { Person, Lock, AccountCircle } from '@material-ui/icons'
import { Link, useHistory, Route, Switch } from 'react-router-dom'
import { auth, db } from '../firebase'
import firebase from  'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useAppDispatch } from '../App'
import { logIn } from '../actions'


const useStyles = makeStyles((theme: Theme) => createStyles({
    gridContainer: {
        [theme.breakpoints.up('md')]: {
            justifyContent: 'space-between',
        },
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(-135deg, rgba(69, 238, 248, 0.9), #456CF8)',
    }
    ,formAuthContainer: {
        zIndex: 10,
        height: '100vh',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
            height: '60vh'
        },
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-start',
            height: '100vh',
        },
    },
    bgAuthPageContainer: {
        [theme.breakpoints.down('md')]: {
            position: 'absolute',
            zIndex: -1,
        },
        [theme.breakpoints.up('md')]: {
            position: 'relative',
            zIndex: 10,
        },
    },
    
    bgAuthPage: {
        width: '100%',
        height: 'auto',
    },
    formAuth: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        [theme.breakpoints.down('md')]: {
            width: '60%',
            background: 'rgba(255, 255, 255, 0.85)',
        },
        [theme.breakpoints.up('md')]: {
            background: 'rgba(255, 255, 255, 0.75)',
            width: '90%',
        },
    },
    typingFields: {
        width: '100%',
        height: '35%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column'
    },
    inputField: {
        width: '75%',
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.fontSize / 3 * 2
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.fontSize
        }
    },
    submitBtn: {
        [theme.breakpoints.down('md')]: {
            width: '50%',
            padding: 5,
            fontSize: theme.typography.fontSize / 2,
        },
        [theme.breakpoints.up('md')]: {
            width: '75%',
            padding: 15,
            fontSize: theme.typography.fontSize * 3 / 2,
        },
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.fontSize / 3 * 2,
            fontWeight: 600,
            marginLeft: 4
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.fontSize + 4,
            fontWeight: 700,
            marginLeft: 8,
        },
    },
    pSignUp: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '10%',
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.fontSize * 2 / 3,
        }
    },
    pSignUpInfo: {
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.fontSize / 3 * 2,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.fontSize,
        }
    },
    googleBtn: {
        color: '#fff',
        backgroundColor: theme.palette.primary.dark,
        [theme.breakpoints.down('md')]: {
            width: '40%',
            fontSize: theme.typography.fontSize / 2,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.fontSize,
            width: '50%',
        },
    },
    svg: {
        maxWidth: '30%',
        minWidth: '20%',
        height: 'auto'
    },
    adornment: {
        [theme.breakpoints.down('md')]: {
            fontSize: theme.typography.fontSize,
            marginBottom: 4
        },
        [theme.breakpoints.up('md')]: {
            fontSize: theme.typography.fontSize * 2,
            marginBottom: 8
        },
    },
    authError: {
        color: theme.palette.error.main
    }
}))

const LoginPage = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState<any>()
    const [error, setError] = useState('')
    const history = useHistory<any>()
    const logInWithEmail = (e:any) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then(credential => {
                dispatch((logIn({
                    displayName: credential.user?.displayName,
                    avatarURL: credential.user?.photoURL,
                    email: credential.user?.email
                })))
            })
            .catch(err => setError(err.code))
        }
        
        const logInWithGoole = async (e:any) => {
            e.preventDefault()
            const provider = new firebase.auth.GoogleAuthProvider()
            const credential = await auth.signInWithPopup(provider)
            await dispatch((logIn({
                    displayName: credential.user?.displayName,
                    avatarURL: credential.user?.photoURL,
                    email: credential.user?.email,
            })))
            const collection:any = credential.user?.email
            db.collection(collection).doc('personal info').set({
                email: credential.user?.email,
                displayName: credential.user?.displayName,
                displayURL: credential.user?.photoURL,
                location: 'Vietnam'
            })
    }

    const signUp = async (e:any) => {
        e.preventDefault()
        try {
            const credential = await auth.createUserWithEmailAndPassword(email, password)
            if (credential.user && credential.user.displayName == null) {
                await credential.user.updateProfile({
                    displayName: displayName,
                    photoURL: `https://avatars.dicebear.com/api/micah/${email}.svg`
                })
            }
            const collection:any = credential.user?.email
            const personnalInfo:any = await db.collection(collection).doc('personal info')
                personnalInfo.set({
                email: credential.user?.email,
                displayName: credential.user?.displayName,
                avatarURL: credential.user?.photoURL,
                location: 'Vietnam'
                })
            history.push('/')
        } catch (err) {
            setError(err.code)
        }
    }
    return (
        <Switch>
            {/* loginform */}
        <Route path='/' exact>
        <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={8} className={classes.bgAuthPageContainer}>
                <img src={bg1} alt='' className={classes.bgAuthPage} />
            </Grid>
            <Grid item xs={12} md={4} container className={classes.formAuthContainer}>
                <form className={classes.formAuth} onSubmit={logInWithEmail}>
                    <svg className={classes.svg} width="184" height="166" viewBox="0 0 184 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M91.5923 0C41.0528 0 0.0922852 34.4969 0.0922852 77.0714C0.0922852 95.45 7.74111 112.272 20.4653 125.5C15.9976 144.175 1.05732 160.812 0.878613 160.998C0.0922852 161.85 -0.122168 163.11 0.34248 164.221C0.807129 165.333 1.80791 166 2.95166 166C26.6487 166 44.4126 154.217 53.2052 146.954C64.8929 151.512 77.8673 154.143 91.5923 154.143C142.132 154.143 183.092 119.646 183.092 77.0714C183.092 34.4969 142.132 0 91.5923 0ZM45.8423 88.9286C39.5159 88.9286 34.4048 83.6299 34.4048 77.0714C34.4048 70.5129 39.5159 65.2143 45.8423 65.2143C52.1687 65.2143 57.2798 70.5129 57.2798 77.0714C57.2798 83.6299 52.1687 88.9286 45.8423 88.9286ZM91.5923 88.9286C85.2659 88.9286 80.1548 83.6299 80.1548 77.0714C80.1548 70.5129 85.2659 65.2143 91.5923 65.2143C97.9187 65.2143 103.03 70.5129 103.03 77.0714C103.03 83.6299 97.9187 88.9286 91.5923 88.9286ZM137.342 88.9286C131.016 88.9286 125.905 83.6299 125.905 77.0714C125.905 70.5129 131.016 65.2143 137.342 65.2143C143.669 65.2143 148.78 70.5129 148.78 77.0714C148.78 83.6299 143.669 88.9286 137.342 88.9286Z" fill="#430CE8"/>
                    </svg>
                    <div className={classes.typingFields}>
                        <InputLabel htmlFor='input-with-icon-adornment'></InputLabel>
                        <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='Email'
                        className={classes.inputField}
                        startAdornment={
                            <InputAdornment position="start" >
                              <Person className={classes.adornment}/>
                            </InputAdornment>
                          }
                          />
                        <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type='password'
                        placeholder='Password'
                        className={classes.inputField}
                        startAdornment={
                            <InputAdornment position="start">
                              <Lock className={classes.adornment}/>
                            </InputAdornment>
                          }
                          />
                        <Button type='submit' className={classes.submitBtn} variant='contained' color='primary'>Log In</Button>
                    </div>
                    <Typography className={classes.authError}>{error}</Typography>
                    <div className={classes.pSignUp}>
                        <Typography variant='subtitle2' className={classes.pSignUpInfo}>
                            Not have an account yet?
                            <Link to='/signup' className={classes.link}>
                                Sign Up
                            </Link>
                        </Typography>
                        <Typography variant='subtitle2' className={classes.pSignUpInfo}>Or</Typography>
                    </div>
                    <Button onClick={logInWithGoole} variant='contained' className={classes.googleBtn}>
                        <svg className={classes.svg} width="40" height="40" viewBox="0 0 57 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M56.3077 32.7484C56.3077 51.0064 45.1269 64 28.6154 64C12.7846 64 0 49.7032 0 32C0 14.2968 12.7846 0 28.6154 0C34.3969 0 39.4903 1.7787 43.7835 4.86778C46.2176 6.61913 46.208 10.0901 44.1658 12.2858C41.9251 14.695 38.1179 14.5431 35.1328 13.1595C24.7463 8.34501 10.8808 16.6125 10.8808 32C10.8808 43.1613 18.8538 52.2065 28.6154 52.2065C34.7921 52.2065 38.8635 49.5071 41.3979 46.2884C44.2384 42.6809 40.7558 38.4129 36.1642 38.4129H34.1186C31.0793 38.4129 28.6154 35.949 28.6154 32.9097C28.6154 29.8703 31.0793 27.4065 34.1186 27.4065H50.4904C53.5842 27.4065 56.3077 29.6546 56.3077 32.7484Z" fill="#FF0000" fill-opacity="0.86"/>
                        </svg>
                        Log in with Google
                    </Button>
                </form>
            </Grid>
        </Grid>
        </Route>

        {/* signuppage */}
        <Route path='/signup'>
        <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={8} className={classes.bgAuthPageContainer}>
                <img src={bg1} alt='' className={classes.bgAuthPage} />
            </Grid>
            <Grid item xs={12} md={4} container className={classes.formAuthContainer}>
            <form className={classes.formAuth}>
                    <svg className={classes.svg} width="184" height="166" viewBox="0 0 184 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M91.5923 0C41.0528 0 0.0922852 34.4969 0.0922852 77.0714C0.0922852 95.45 7.74111 112.272 20.4653 125.5C15.9976 144.175 1.05732 160.812 0.878613 160.998C0.0922852 161.85 -0.122168 163.11 0.34248 164.221C0.807129 165.333 1.80791 166 2.95166 166C26.6487 166 44.4126 154.217 53.2052 146.954C64.8929 151.512 77.8673 154.143 91.5923 154.143C142.132 154.143 183.092 119.646 183.092 77.0714C183.092 34.4969 142.132 0 91.5923 0ZM45.8423 88.9286C39.5159 88.9286 34.4048 83.6299 34.4048 77.0714C34.4048 70.5129 39.5159 65.2143 45.8423 65.2143C52.1687 65.2143 57.2798 70.5129 57.2798 77.0714C57.2798 83.6299 52.1687 88.9286 45.8423 88.9286ZM91.5923 88.9286C85.2659 88.9286 80.1548 83.6299 80.1548 77.0714C80.1548 70.5129 85.2659 65.2143 91.5923 65.2143C97.9187 65.2143 103.03 70.5129 103.03 77.0714C103.03 83.6299 97.9187 88.9286 91.5923 88.9286ZM137.342 88.9286C131.016 88.9286 125.905 83.6299 125.905 77.0714C125.905 70.5129 131.016 65.2143 137.342 65.2143C143.669 65.2143 148.78 70.5129 148.78 77.0714C148.78 83.6299 143.669 88.9286 137.342 88.9286Z" fill="#430CE8"/>
                    </svg>
                    <div className={classes.typingFields}>
                        <InputLabel htmlFor='input-with-icon-adornment'></InputLabel>
                        <Input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder='Display name'
                        className={classes.inputField}
                        startAdornment={
                            <InputAdornment position="start" >
                              <Person className={classes.adornment}/>
                            </InputAdornment>
                          }
                          />
                        <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='Email'
                        className={classes.inputField}
                        startAdornment={
                            <InputAdornment position="start" >
                              <AccountCircle className={classes.adornment}/>
                            </InputAdornment>
                          }
                          />
                        <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type='password'
                        placeholder='Password'
                        className={classes.inputField}
                        startAdornment={
                            <InputAdornment position="start">
                              <Lock className={classes.adornment}/>
                            </InputAdornment>
                          }
                          />
                    </div>
                    <Button onClick={signUp} variant='contained' className={classes.submitBtn} color='primary'>Sign Up</Button>
                    <Typography className={classes.authError}>{error}</Typography>
                </form>
            </Grid>
        </Grid>
        </Route>
        </Switch>
    )
}

export default LoginPage
