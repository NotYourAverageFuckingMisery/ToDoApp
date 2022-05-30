import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import APIRequest from './APIrequest'

const Login = ({logger, setLogger, setAuthorised}) => {

    const [pwd, setPwd] = useState('')
    const [log, setLog] = useState('')
    const [redirect, setRedirect] = useState(false)

    const submitLogin = async (e) => {
        e.preventDefault()
        const updateOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({user_login: log, user_password: pwd})
          }
        const result = await APIRequest("http://localhost:8081/login", updateOptions)
        if (result) {
          console.log(result)
        } else {
          setRedirect(true)
          setAuthorised(true)
        }
        setLogger(!logger)
    }

    if (redirect) {
      return <Navigate to="/"/>
    }

  return (
    <div className='loginDiv'>
        <form onSubmit={submitLogin}>
            <h2 className='loginHeader'>Welcome to my to do app!</h2>
            <ul className='loginList'>
                <li>
                    <label>Login:</label>
                    <input 
                    type='text'
                    onChange={(e) => setLog(e.target.value)}>

                    </input>
                </li>
                <li>
                    <label>Password:</label>
                    <input 
                    type='password' 
                    onChange={(e) => setPwd(e.target.value)}>

                    </input>
                </li>
                <li>
                    <button>Enter</button>
                </li>
                <li>Don't have an account? <Link to='/register'>Register</Link></li>
            </ul>
        </form>
    </div>
  )
}

export default Login