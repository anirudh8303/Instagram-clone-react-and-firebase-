import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Input, Button } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState("");
  const [openSignIn, setOpenSignIn] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, [posts]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const handleOpen = (event) => {
    setOpen(true);
  };
  const handleClose = (event) => {
    setOpen(false);
  };
  const handleLogin = (event) => {
    setOpenSignIn(true);
  };
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
    });
    setOpenSignIn(false);
  };
  return (
    <div className="App">
      <div className="App_header">
        <img
          className="app_image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram"
        />
        {user ? (
          <div class="mycls">
            <h4 style={{ fontStyle: "italic" }}> Welcome</h4>
            <Button type="button" onClick={() => auth.signOut()}>
              Log Out
            </Button>
          </div>
        ) : (
          <div class="modal_buttons">
            <Button type="button" onClick={handleOpen}>
              Sign Up
            </Button>
            <Button type="button" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <center>
              <img
                className="modal_image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram"
              />
            </center>
            <form className="input_parameters">
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signUp}>Sign Up</Button>
            </form>
          </div>
        </Modal>

        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <center>
              <img
                className="modal_image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram"
              />
            </center>
            <form className="input_parameters">
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signIn}>Log In</Button>
            </form>
          </div>
        </Modal>
      </div>
      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 style={{ fontStyle: "italic" }}>
          Sorry You Have To login to upload
        </h3>
      )}
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
