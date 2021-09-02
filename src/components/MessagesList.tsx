import { useState, useEffect } from 'react'
import { Grid, InputAdornment, Input } from "@material-ui/core"
import { Search } from '@material-ui/icons'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import MessageBox from "./MessageBox"
import { db } from '../firebase'
import { useAppSelector } from '../App'

const useStyles = makeStyles((theme: Theme) => createStyles({
    messagesList: {
        border: '1px solid',
        borderColor: theme.palette.secondary.main,
        [theme.breakpoints.down('md')]: {
            borderRadius: 0,
        },
        [theme.breakpoints.up('md')]: {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12
        },
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: theme.palette.type === 'light' ? '#fff' : '#000'
    },
    downSearchBar: {
        maxHeight: '90%',
        overflowY: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.palette.text.primary
    },
    searchBar: {
        height: '70%',
        marginTop: '7.5%',
        marginBottom: '2.5%',
        width: '90%'
    },
    formSearch: {
        height: '5%',
    }
}))


const MessagesList = () => {
    const classes = useStyles()
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const email = isLogedIn.email
    const name = isLogedIn.displayName
    const avatarURL = isLogedIn.avatarURL
    const [searchText, setSearchText] = useState('')
    const [messBox, setMessBox] = useState<Array<any>>([])

    useEffect(() => {
        db.collection(email).where('mess', '==', true)
            .onSnapshot(snap => {
                setMessBox(snap.docs.map(doc => ({
                    avatarURL: doc.data().avatarURL,
                    name: doc.data().name,
                    email: doc.data().email,
                    lastMess: doc.data().lastMess,
                    timestamp: doc.data().timestamp
                })))
            })
    }, [])

    const searchUser = async (e:any) => {
        e.preventDefault()
        await db.collection(searchText).doc('personal info').collection('friend request').doc(email).set({
            from: name,
            email: email,
            avatarURL: avatarURL,
            status: 'pending'
        })
        setSearchText('')
    }

    return (
        <Grid className={classes.messagesList} item xs={12} md={3} container direction='column' alignItems='center' justifyContent='flex-start'>
            <form className={classes.formSearch} onSubmit={searchUser}>
            <Input 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className={classes.searchBar} startAdornment={
                <InputAdornment position="start">
                <Search />
                </InputAdornment>
            } />
            </form>
            <div className={classes.downSearchBar}>
            {
                messBox.map(item => (
                    <MessageBox timestamp={item.timestamp} name={item.name} avatarURL={item.avatarURL} email={item.email} lastMess={item.lastMess} /> 
                ))
            }
            </div>
        </Grid>
    )
}

export default MessagesList
