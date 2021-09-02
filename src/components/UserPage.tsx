import { useState, useEffect } from 'react'
import { Avatar, Grid, Typography, IconButton, Dialog,  Input, Button } from "@material-ui/core"
import { Route } from "react-router-dom"
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { PhotoCamera, Create, PersonAdd, SupervisorAccount } from '@material-ui/icons'
import FriendRequest from './FriendRequest'
import FriendContact from './FriendContact'
import { useAppSelector } from '../App'
import { db } from '../firebase'

const useStyles = makeStyles((theme: Theme) => createStyles({
    containee: {
        backgroundImage: theme.palette.type === 'light' ?  'linear-gradient(135deg, rgba(57, 146, 235, 0.89), rgba(111, 172, 217, 0.43))' : 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(55, 9, 9, 1))',
        height: '100vh',
        borderRadius: 12
    },
    upper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '50%',
        backgroundColor: 'rgba(63, 118, 226, 0.21)'
    },
    avatarField: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '60%',
        alignItems: 'center'
    },
    avatar: {
        width: 120,
        height: 120
    },
    numberField: {
        display: 'flex',
        justifyContent: 'space-around',
        height: '40%',
        alignItems: 'center',
        width: '100%'
    },
    oneInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorInfo: {
        color:theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        fontWeight: 700
    },
    under: {
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'space-around',
    },
    underField: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    input: {
        display: 'none'
    },
    inputText: {
        padding: 8,
        fontSize: theme.typography.fontSize
    },
    iconUpper: {
        fontSize: theme.typography.h3.fontSize
    },
    iconUpperField: {
        display: 'flex',
        alignItems: 'center',
    },
    requestedList: {
        display: 'flex',
        flexDirection: 'column',
        width: '95%',
        height: '45%',
    },
    lists: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '95%',
        overflowY: 'auto'
    },
    textColor: {
        color: theme.palette.type === 'light' ? '#000' : '#fff'
    }
}))

interface friendRequestObj {
    name: any,
    avatarURL: any,
    email: any
}

const UserPage = () => {
    const [friendRequest, setFriendRequest] = useState<Array <friendRequestObj> >([])
    const [friendContact, setFriendContact] = useState<Array <friendRequestObj> >([])
    const [inputs, setInputs] = useState('')
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const yourName = isLogedIn.displayName
    const email = isLogedIn.email

    useEffect(() => {
        db.collection(email).doc('personal info').collection('friend request')
            .where('status', '==', 'pending')  
            .onSnapshot((querySnap) => {
                setFriendRequest(querySnap.docs.map(doc => ({
                    name: doc.data().from,
                    email: doc.data().email,
                    avatarURL: doc.data().avatarURL
                })))
            })

        db.collection(email).doc('personal info').collection('friend contact')
            .onSnapshot((querySnap) => {
                setFriendContact(querySnap.docs.map(doc => ({
                    name: doc.data().name,
                    email: doc.data().email,
                    avatarURL: doc.data().avatarURL
                })))
            })
    }, [])
    const [open2, setOpen2] = useState(false)

    const handleClickOpen2 = () => {
        setOpen2(true)
    }


    const handleClose2 = () => {
        setOpen2(false)
        setInputs('')
    }

    const changeName = async (e:any) => {
        e.preventDefault()
        await db.collection(email).doc('personal info').update({
            displayName: inputs
        })
        setOpen2(false)
    }

  

    const classes = useStyles()
    return (
        <Route path='/profile'>
            <Grid item container xs={12} md={12}>
            <Grid item xs={12} md={5} direction='column' justifyContent='space-around' className={classes.containee}>
                <div className={classes.upper}>
                    <div className={classes.avatarField}>
                        <Avatar src={isLogedIn.avatarURL} alt='' className={classes.avatar} />
                        <Typography variant='h3' className={classes.textColor}>{yourName}</Typography>
                    </div>
                    <div className={classes.numberField}>
                        <div className={classes.oneInfo}>
                            <Typography variant='subtitle1' className={classes.textColor}>From</Typography>
                            <Typography variant='h5' className={classes.colorInfo}>Vietnam</Typography>
                        </div>
                    </div>
                </div>
                <div className={classes.under}>
                    <div className={classes.underField}>
                        <div>
                            <input className={classes.input} id="avt-button-file" type="file" />
                            <label htmlFor="avt-button-file">
                                <IconButton className={classes.textColor} component="span">
                                    <PhotoCamera />
                                    <Typography variant='subtitle1'>Avatar</Typography>
                                </IconButton>
                            </label>
                        </div>
                        <div>
                            <IconButton className={classes.textColor} onClick={handleClickOpen2}>
                                <Create />
                                <Typography variant='subtitle1'>Name</Typography>
                            </IconButton>
                            <Dialog
                                open={open2}
                                onClose={handleClose2}
                                >
                                    <form onSubmit={changeName}>
                                        <Input value={inputs} onChange={e => setInputs(e.target.value)} className={classes.inputText} type='text' placeholder='Type your name here...' />
                                        <button type='submit'>Change</button>
                                    </form>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </Grid>
                <Grid xs={12} md={7} item container direction='column' justifyContent='space-around' >
                    <div className={classes.requestedList}>
                        <div className={classes.iconUpperField}>
                            <PersonAdd color='primary' className={classes.iconUpper} />
                            <Typography variant='subtitle2' className={classes.textColor}>Requested contacts</Typography>
                        </div>
                        <div className={classes.lists}>
                            {
                                friendRequest.map(req => (
                                    <FriendRequest name={req.name} avatarURL={req.avatarURL} email={req.email} />
                                ))
                            }
                        </div>
                    </div>
                    <div className={classes.requestedList}>
                        <div className={classes.iconUpperField}>
                            <SupervisorAccount color='primary' className={classes.iconUpper} />
                            <Typography variant='subtitle2' className={classes.textColor}>Contact list</Typography>
                        </div>
                        <div className={classes.lists}>
                        {
                                friendContact.map(req => (
                                    <FriendContact name={req.name} avatarURL={req.avatarURL} email={req.email} />
                                ))
                            }
                        </div>
                    </div>
                </Grid>
        </Grid>
        </Route>
    )
}

export default UserPage
