import { auth, handleSignOut } from '../firebase';
import { Button, Form, Modal } from 'react-bootstrap';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleShowSignUp = () => setShowSignUp(true);
    const handleCloseSignUp = () => setShowSignUp(false);

    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                console.log(uid);
                setIsLoggedIn(true)
            } else {
                console.log('not signed in')
                setIsLoggedIn(false);
            }
        });
    }, [])

    function handleSignUp(e: any) {
        e.preventDefault()
        const { email, password } = e.target.elements
        console.log({ email: email.value, password: password.value })
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
            })
        setShowSignUp(false)
    }

    function handleLogin(e: any) {
        e.preventDefault()
        const { email, password } = e.target.elements
        console.log({ email: email.value, password: password.value })
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
            })
        setShowLogin(false)
    }
    
    return (
        <>
            <h1 className="text-center my-3 title">Rich Farmer Poor Farmer</h1>
            <p className='text-center my-3'>Please login to access the game!</p>
            <div className='text-center'>
                <Button className='mx-3' onClick={handleShowLogin}>Login</Button>
                <Button className='mx-3' onClick={handleShowSignUp}>Sign Up</Button>
            </div>
            <div className='text-center'>
                {isLoggedIn && <Button className='my-3' onClick={handleSignOut}>Sign Out</Button>}
            </div>
            <Modal show={showSignUp} onHide={handleCloseSignUp}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>Sign Up</Modal.Title>
                    </Modal.Header>
                </>
                <Modal.Body>
                    <Form onSubmit={handleSignUp}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showLogin} onHide={handleCloseLogin}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>Log In</Modal.Title>
                    </Modal.Header>
                </>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Login;