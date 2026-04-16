import React from 'react'
import { useNavigate , Link} from 'react-router';
import { useState } from 'react';
import {useAuth} from "../hooks/useAuth";
function Register() {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");   
    const {handleRegister,loading} = useAuth();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.prevenDefault();
        handleRegister({username,email,password});
        navigate("/");
    }
    if(loading){
        return <div>Loading...</div>
    }
  return (
    <main>
        <div className='form-container'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" placeholder='Enter your Username' />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder='Enter your Email' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder='Enter your password' />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register