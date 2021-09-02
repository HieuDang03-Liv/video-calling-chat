import { Avatar, Button, Typography } from '@material-ui/core'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Delete, Done } from '@material-ui/icons'
import { FC } from 'react'
import { db } from '../firebase'
import { useAppSelector } from '../App'

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
        width: 50,
        height: 50
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
    }
}))

interface Props {
    avatarURL: string,
    name: string,
    email: string
}

const FriendRequest:FC<Props> = (props) => {
    const classes = useStyles()
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const email = isLogedIn.email
    const yourName = isLogedIn.displayName
    const avatarURL = isLogedIn.avatarURL

    const acceptFriend = async () => {
        await db.collection(email).doc('personal info').collection('friend request').doc(props.email).update({
            status: 'accepted'
        })

        db.collection(email).doc('personal info').collection('friend contact').doc(props.email).set({
            email: props.email,
            name: props.name,
            avatarURL: props.avatarURL
        })
        db.collection(props.email).doc('personal info').collection('friend contact').doc(email).set({
            email: email,
            name: yourName,
            avatarURL: avatarURL
        })
    }
    const deleteFriend = () => {
        db.collection(email).doc('personal info').collection('friend request').doc(props.email).update({
            status: 'deleted'
        })
    }

    return (
        <div className={classes.containee}>
            <div className={classes.avatarField}>
                <Avatar src={props.avatarURL} alt='' className={classes.avatar} />
                <Typography className={classes.name}>{props.name}</Typography>
            </div>
            <div className={classes.twoBtn}>
                <Button onClick={acceptFriend} size='small' className={classes.buttonAccept} variant='contained' startIcon={<Done />}>
                    Accept
                </Button>
                <Button onClick={deleteFriend} size='small' className={classes.buttonDelete} variant='contained' startIcon={<Delete />}>
                    Delete
                </Button>
            </div>
        </div>
    )
}

export default FriendRequest
