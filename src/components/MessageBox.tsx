import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Avatar, Typography } from '@material-ui/core'
import { FC } from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({
    boxMessage: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '95%',
        height: '15vh',
        padding: '0 1.5%',
        marginTop: '2%',
        textDecoration: 'none',
        border: 'none',
        color: '#000',
        '&:hover': {
            backgroundColor: theme.palette.info.main,
            borderRadius: 12,
        },
        '&:focus': {
            backgroundColor: theme.palette.info.light,
            borderRadius: 12,
        }
    },
    typography: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        marginLeft: 8
    },
    mainAvatar: {
        display: 'flex',
        width: '80%',
        alignItems: 'center'
    },
    p: {
        color: theme.palette.text.primary
    }
}))

interface Propss {
    avatarURL: '',
    name: '',
    lastMess: any,
    email: '',
    timestamp: any
}

const MessageBox:FC<Propss> = (props) => {
    const classes = useStyles()
    return (
        <Link to={`/messages/${props.email}`} className={classes.boxMessage}>
                  <div className={classes.mainAvatar}>
                    <Avatar alt='' src={props.avatarURL} />
                    <div className={classes.typography}>
                        <Typography className={classes.p} variant='subtitle1'>{props.name}</Typography>
                        <Typography variant='subtitle2'>{props.lastMess}</Typography>
                    </div>
                  </div>
                  <div className={classes.typography}>
                      <Typography variant='subtitle2'>{props.timestamp}</Typography>
                  </div>
        </Link>
    )
}

export default MessageBox
