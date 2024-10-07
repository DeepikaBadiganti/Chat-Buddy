import './App.css';
import {Route,Switch} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Chatpage from './pages/Chatpage'
import Notfound from './pages/Notfound'


function App() {
  return (
    <div className="App animated-background">
      <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/chats" component={Chatpage} />
      <Route component={Notfound} />
      </Switch>
    </div>
  );
}

export default App;
