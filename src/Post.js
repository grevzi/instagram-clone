import React, {useEffect, useState} from "react";
import './Post.css'
import {Avatar, Button, FormControl, Input} from "@material-ui/core";
import db from "./firebase";
import firebase from "firebase";

const Post = ({id, authUser, username, imageUrl, caption}) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if (id) {
            unsubscribe = db
                .collection('posts')
                .doc(id)
                .collection('comments')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()))
                })
        }

        return () => unsubscribe()
    }, [id])

    function postComment(e) {
        e.preventDefault()

        db.collection('posts').doc(id).collection('comments').add({
            text: comment,
            username: authUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setComment('')
    }

    return (
        <div className="post">
            {/*header -> avatar + username*/}
            <div className="post__header">

                <Avatar className="post__avatar"
                        src="https://instagram.fiev2-1.fna.fbcdn.net/v/t51.2885-19/s150x150/69109261_723182418146689_4328166186312269824_n.jpg?tp=1&_nc_ht=instagram.fiev2-1.fna.fbcdn.net&_nc_ohc=YCd2hM90BbMAX9HQFiO&edm=ALlQn9MBAAAA&ccb=7-4&oh=03571f32a5330e02423eb837027006ad&oe=60C07A08&_nc_sid=48a2a6"
                        alt={username}
                />

                <p className="post__username">{username}</p>

            </div>

            {/* image */}
            <img className="post__image" src={imageUrl} alt="logo"/>

            {/* username + caption */}
            <p className="post__text"><strong>{username}</strong>: {caption}</p>

            {comments.length > 0 && (
                <div className="post__comments">
                    {comments.map((comment, key) => (
                        <p key={key}>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
                </div>
            )}

            { authUser ? (
                <form className="post__comment-box" onSubmit={postComment}>
                    <Input
                        className="post__input"
                        placeholder="email"
                        type="text"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <FormControl>
                        <Button type="submit" className="post__button">Add</Button>
                    </FormControl>
                </form>
            ) : (
                <p className="post__leave-comment">Login to leave a comment</p>
            )}

        </div>
    )
}

export default Post