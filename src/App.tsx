
import 'bootstrap/dist/css/bootstrap.min.css';
import Game from './components/game';
import Login from './components/login';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { auth, handleSignOut } from './firebase';
import { Button } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<User>()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setLoggedInUser(user);
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    });
  }, [])
  return (
    <div className="App">
      {isLoggedIn ? <Game loggedInUser={loggedInUser} /> : <Login/>}
      {isLoggedIn && <Button className='my-5' onClick={handleSignOut}>Logout</Button>}
    </div>
  );
}

export default App;
