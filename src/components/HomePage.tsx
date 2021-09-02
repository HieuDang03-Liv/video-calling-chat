import { Grid } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MainPage from "./MainPage"
import NavBar from "./NavBar"
import UserPage from "./UserPage"

const useStyles = makeStyles((theme: Theme) => createStyles({
    rootHomePage: {
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
        alignItems: 'space-around',
    },
    rootMessage: {
        backgroundColor: theme.palette.type === 'light' ? '#fff' : '#000'
    }
}))

const HomePage = () => {
    const classes = useStyles()
    return (
        <Grid container justifyContent='space-between' className={classes.rootHomePage}>
            <Grid item xs={12} md={1}>
                <NavBar />
            </Grid>
            <Grid item xs={12} md={11} container className={classes.rootMessage}>
                <MainPage />
                <UserPage />
            </Grid>
        </Grid>
    )
}

export default HomePage
