import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Avatar, Typography } from '@material-ui/core'
import { Fragment } from 'react'
import { useAppSelector } from '../App'
import { FC } from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({
   friendsMessage: {
        alignSelf: 'flex-start',
        display: 'flex',
        marginTop: '2.5%',
   },
   friendsMessageContent: {
       backgroundColor: theme.palette.type === 'light' ? '#fff' : '#000',
       fontSize: '1rem',
       border: 'none',
       padding: 8,
       borderTopLeftRadius: 12,
       borderBottomRightRadius: 12,
       width: 'content-fit',
       height: 'auto',
       marginLeft: 16,
       color: theme.palette.type === 'light' ? '#000' : '#fff'
   },
   ownMessage: {
        alignSelf: 'flex-end',
        display: 'flex',
        flexDirection: 'row-reverse',
        maxWidth: '90%',
        marginTop: '2.5%'
   },
   ownMessageContent: {
       backgroundColor: theme.palette.primary.main,
       fontSize: '1rem',
       border: 'none',
       padding: 8,
       borderTopRightRadius: 12,
       borderBottomLeftRadius: 12,
       width: 'content-fit',
       height: 'auto',
       marginRight: 16,
       color: '#fff'
   }
}))

interface Props {
    from: '',
    content: '',
    avatarSend: ''
}

const Message:FC<Props> = (props) => {
    const classes = useStyles()
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const yourEmail = isLogedIn.email
    const yourAvatar = isLogedIn.avatarURL
    const areYou = yourEmail === props.from ? classes.ownMessage : classes.friendsMessage
    const areYouContent = yourEmail === props.from ? classes.ownMessageContent : classes.friendsMessageContent
    return (
        <Fragment>
            <div className={`${areYou}`}>
                <Avatar src={yourEmail === props.from ? yourAvatar : props.avatarSend} alt='' />
                <Typography className={areYouContent}>{props.content}</Typography>
            </div>
        </Fragment>
    )
}

export default Message
