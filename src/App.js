import './App.css';
import Post from "./Post";
import {useEffect, useState} from "react";
import db from "./firebase";

function App() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        db.collection('posts').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc =>  ({
                id: doc.id,
                ...doc.data()
            })))
        })
    }, [])

  return (
    <div className="app">
        {/*Header*/}
        <div className="app__header">
          <img className="app__header-image"
              src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"/>
        </div>

        {posts.map((post, key) => (<Post key={post.id} {...post}/>))}
    </div>
  );
}

export default App;
