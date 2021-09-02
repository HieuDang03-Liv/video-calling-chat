import { Avatar, Button, Typography } from '@material-ui/core'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Email, Delete } from '@material-ui/icons'
import { FC } from 'react'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../App'
import firebase from 'firebase/app'

const useStyles = makeStyles((theme: Theme) => createStyles({
    containee: {
        display: 'flex',
        width: '30%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: theme.palette.info.main,
        padding: 12,
        borderRadius: 12,
        margin: 8
    },
    name: {
        fontSize: 24,
        color: theme.palette.type === 'light' ? '#000' : '#fff'
    },
    avatarField: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatar: {
        width: 60,
        height: 60
    },
    buttonAccept: {
        background: theme.palette.primary.main,
        color: '#fff',
        fontSize: 12
    },
    buttonDelete: {
        background: theme.palette.error.main,
        color: '#fff',
        fontSize: 12
    },
    twoBtn: {
        display: 'flex'
    },
    link: {
        textDecoration: 'none'
    }
}))

interface Props {
    avatarURL: string,
    name: string,
    email: string
}

const FriendContact:FC<Props> = (props) => {
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const email = isLogedIn.email
    const yourName = isLogedIn.displayName
    const avatarURL = isLogedIn.avatarURL
    const classes = useStyles()
    const deleteFriend = () => {
        db.collection(email).doc('personal info').collection('friend contact').doc(props.email).delete()
        db.collection(email).doc(`messages with ${props.email}`).delete()
    }
    const sayHi = () => {
        db.collection(email).doc(`messages with ${props.email}`).set({
            mess: true,
            name: props.name,
            email: props.email,
            avatarURL: props.avatarURL,
            lastMess: 'Hello <3',
            timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`
        })
        db.collection(email).doc(`messages with ${props.email}`).collection(`messages with ${props.email}`).add({
            content: 'Hello <3',
            fromEmail: email,
            fromAvatar: avatarURL,
            to: props.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        db.collection(props.email).doc(`messages with ${email}`).set({
            mess: true,
            name: yourName,
            email: email,
            avatarURL: avatarURL,
            lastMess: 'Hello <3',
            timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`
        })
        db.collection(props.email).doc(`messages with ${email}`).collection(`messages with ${email}`).add({
            content: 'Hello <3',
            fromAvatar: avatarURL,
            fromEmail: email,
            to: props.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }
    return (
        <div className={classes.containee}>
        <div className={classes.avatarField}>
            <Avatar src={props.avatarURL} alt='' className={classes.avatar} />
            <Typography className={classes.name}>{props.name}</Typography>
        </div>
        <div className={classes.twoBtn}>
            <Link to={`/messages/${props.email}`} onClick={sayHi} className={classes.link}>
                <Button size='small' className={classes.buttonAccept} variant='contained' startIcon={<Email />}>
                    Contact
                </Button>
            </Link>
            <Button onClick={deleteFriend} size='small' className={classes.buttonDelete} variant='contained' startIcon={<Delete />}>
                Delete
            </Button>
        </div>
    </div>
    )
}

export default FriendContact
