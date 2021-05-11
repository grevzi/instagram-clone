import React, {useRef, useState} from "react";
import {Button, FormControl, Input} from "@material-ui/core";
import {auth, db, storage} from "./firebase";
import firebase from "firebase";
import './ImageUpload.css'

const ImageUpload = ({username}) => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const fileInput = useRef()

    function handleChange(e) {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    function handleUpload(e) {
        e.preventDefault()
        if (!image) return

        const upload = storage.ref(`/images/${image.name}`).put(image)

        upload.on("state_changed",
            snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)

                setProgress(progress)
            },
            error => console.error(error),
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption,
                            imageUrl : url,
                            username : username
                        })

                        setProgress(0)
                        setCaption('')
                        setImage(null)
                        fileInput.current.value = null
                    })
            }
        )
    }

    return (
        <div className="image-upload">
            <form className="image-upload__form" onSubmit={handleUpload}>
                <progress className="image-upload__progress" value={progress} max={100}/>
                <FormControl>
                    <Input
                        placeholder="Enter the caption"
                        type="text"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Input
                        inputRef={fileInput}
                        type="file"
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl>
                    <Button type="submit">Upload</Button>
                </FormControl>
            </form>
        </div>
    )
}

export default ImageUpload