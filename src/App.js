import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] =useState({
    isSignedIn:false,
    name: '',
    email: '',
    photo: '',
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL ,email}=res.user;
      const isSignedIn ={
        isSignedIn:true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(isSignedIn);
      console.log(displayName, email ,photoURL);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.massage);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        isValid: '',
        existingUser: false
        
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  const is_valid_email = email =>  /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const hasNumber = input => /\d/.test(input);
  const switchForm = e =>{
  //  console.log(e.target.checked);
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }

  const handleChange = e =>{
    const newUserInfo ={
      ...user
    };
    let isValid = true;
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    }
    if(e.target.name === 'password'){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

//console.log(e.target.name,e.target.value,isValid)

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid
    setUser(newUserInfo);
  }

  const creatAccount = (even) =>{
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(res =>{
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error ='';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    else{
      console.log('form is not valid',user)
    }
  //  event.preventDefault();
  //  event.target.reset();

  }

  const signInUser = event =>{
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
        {
          user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>:
          <button onClick={handleSignIn} >Sign in</button>
        }
        {
          user.isSignedIn && <div>
                <h2>welcome, {user.name}</h2>
                <p>{user.email}</p>
                <img src={user.photo} alt=""/>
          </div>
          
        }
        <h2>our owner auther</h2>
        <label htmlFor="switchForm">Returning user
            <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
        </label>
        <form style={{display:user.existingUser ? 'block': 'none'}} onSubmit={signInUser}>
            <input type="text" onBlur={handleChange} name="email" placeholder="your email" required/>
            <br/>
            <input type="password" onBlur={handleChange} name="password" placeholder="your password" required/>
            <br/>
            <input type="submit" value="SignIn"/>
        </form>
        <form style={{display:user.existingUser ? 'none': 'block'}} onSubmit={creatAccount}>
            <input type="text" onBlur={handleChange} name="name" placeholder="your name" required/>
            <br/>
            <input type="text" onBlur={handleChange} name="email" placeholder="your email" required/>
            <br/>
            <input type="password" onBlur={handleChange} name="password" placeholder="your password" required/>
            <br/>
            <button onClick={creatAccount}>Creat Account</button>
        </form>
        

    </div>
  );
}

export default App;
