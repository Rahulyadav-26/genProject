import React from 'react'
import { useState } from 'react';
import "../auth.form.scss";
import { Link } from 'react-router';
import {useAuth} from "../hooks/useAuth";
import { useNavigate } from 'react-router';
function Login() {
    const {loading , handleLogin} = useAuth();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin({email,password});
        navigate("/");
    }

    if(loading){
        return <div>Loading...</div>
    }

  return (
    <main>  
        <div className='form-container'>
            <h1>Login</h1>
             <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
             </form>
             <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login