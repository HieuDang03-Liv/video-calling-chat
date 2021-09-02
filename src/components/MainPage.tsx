import { Route, Switch } from 'react-router-dom'
import MessageContent from './MessageContent'
import MessagesList from "./MessagesList"

const MainPage = () => {
    return (
        <Route path='/messages'>
            <MessagesList />
            <Switch>
                <Route path='/messages/:email' exact>
                <MessageContent />
                </Route>
            </Switch>
        </Route>
    )
}

export default MainPage
