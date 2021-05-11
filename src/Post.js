import React from "react";
import './Post.css'
import {Avatar} from "@material-ui/core";

const Post = ({username, imageUrl, caption}) => {
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
        </div>
    )
}

export default Post