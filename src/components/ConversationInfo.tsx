import { useState } from 'react'
import { List, ListItem, ListItemIcon, Collapse, Grid, ListItemText, Avatar, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { QuestionAnswer, InsertDriveFile, PhotoLibrary, ExpandLess, ExpandMore, Create, Favorite } from '@material-ui/icons'
import { FC } from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({
    infoConversation: {
        height: '100%',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            display: 'block'
        },
        backgroundColor: theme.palette.type === 'light' ? '#fff' : '#000'
    },
    headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        height: '20%',
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    infoAvatar: {
        width: 80,
        height: 80
    },
    statusP: {
        fontSize: theme.typography.subtitle2.fontSize,
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
    },
    nameAvatar: {
        color: theme.palette.type === 'light' ? '#000' : '#fff'
    }
}))

interface Props {
    avatar: '',
    name: ''
}

const ConversationInfo:FC<Props> = (props) => {
    const classes = useStyles()
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open)
    }
    return (
        <Grid item xs={12} md={3} direction='column' alignItems='center' justifyContent='flex-start' className={classes.infoConversation}>
                <div className={classes.headerInfo}>
                    <Avatar src={props.avatar} alt=''  className={classes.infoAvatar}/>
                    <Typography variant='subtitle1' className={classes.nameAvatar}>{props.name}</Typography>
                    <Typography className={classes.statusP}>Active now</Typography>
                </div>
                <List
                component="nav"
                >
                <ListItem button onClick={handleClick}>
                    <ListItemIcon>
                        <QuestionAnswer />
                    </ListItemIcon>
                    <ListItemText primary="Customize conversation" className={classes.nameAvatar} />
                    {open ? <ExpandLess className={classes.nameAvatar} /> : <ExpandMore className={classes.nameAvatar} />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button>
                            <ListItemIcon>
                            <Create />
                            </ListItemIcon>
                            <ListItemText primary="Change nicknames" className={classes.nameAvatar} />
                        </ListItem>
                    </List>
                    <List component="div" disablePadding>
                        <ListItem button>
                            <ListItemIcon>
                            <Favorite color='error' />
                            </ListItemIcon>
                            <ListItemText primary="Change emoji" className={classes.nameAvatar} />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button>
                    <ListItemIcon>
                        <InsertDriveFile />
                    </ListItemIcon>
                    <ListItemText primary="Shared files" className={classes.nameAvatar} />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <PhotoLibrary />
                    </ListItemIcon>
                    <ListItemText primary="Shared Images/Video" className={classes.nameAvatar} />
                </ListItem>
                </List>
            </Grid>
    )
}

export default ConversationInfo
