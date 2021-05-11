import './App.css';
import Post from "./Post";
import {useEffect, useState} from "react";
import db, {auth} from "./firebase";
import {Button, FormControl, Input, makeStyles, Modal} from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top      : `${top}%`,
        left     : `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position       : 'absolute',
        width          : 400,
        backgroundColor: theme.palette.background.paper,
        border         : '2px solid #000',
        boxShadow      : theme.shadows[5],
        padding        : theme.spacing(2, 4, 3),
    }
}));


function App() {
    const classes = useStyles();
    const [posts, setPosts] = useState([])
    const [modalStyle] = useState(getModalStyle);

    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => setUser(authUser))
        return () => unsubscribe()
    }, [user, username])

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })))
        })
    }, [])

    useEffect(() => {
        document.title = "Instagram Clone"
    }, []);

    function singUp(e) {
        e.preventDefault()
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                setOpen(false)
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch(error => console.error(error.message))
    }

    function singIn(e) {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then(r => {
                console.log(r)
                setOpenSignIn(false)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="app">

            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="sign-up">
                        <img className="sign-up__image"
                             src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                             alt="logo"/>

                        <form className="sign-up__form" onSubmit={singUp}>
                            <FormControl>
                                <Input
                                    placeholder="username"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <Input
                                    placeholder="email"
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <Input
                                    placeholder="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <Button type="submit">Sing Up</Button>
                            </FormControl>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="sign-up">
                        <img className="sign-up__image"
                             src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                             alt="logo"/>

                        <form className="sign-up__form" onSubmit={singIn}>

                            <FormControl>
                                <Input
                                    placeholder="email"
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <Input
                                    placeholder="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <Button type="submit">Sing In</Button>
                            </FormControl>
                        </form>
                    </div>
                </div>
            </Modal>

            <div className="app__header">
                <img className="app__header-image"
                     src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                     alt="logo"/>

                {user ? (
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                ) : (
                    <div className="app__login-container">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                ) }
            </div>

            <div className="app__posts">
                <div>
                    {posts.map((post, key) => (<Post key={post.id} authUser={user} {...post}/>))}
                </div>
                <div>
                    <InstagramEmbed
                        url='https://instagr.am/p/COuQFheD7wY/'
                        clientAccessToken='798257084137761|3829e0a2d1995ab42d53f4b9301647d4'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>
            </div>

            { user?.displayName ? (
                <ImageUpload username={user.displayName}/>
            ) : (
                <p className="app__login-to-upload"><b>Login to upload.</b></p>
            )}
        </div>
    );
}

export default App;
