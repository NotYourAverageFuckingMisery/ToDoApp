import React from 'react'
import { Link } from 'react-router-dom'
import APIRequest from './APIrequest'

const Nav = ({setOptions, logger, setLogger, setAuthorised}) => {

  const logout = async () => {
    const updateOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
    }
  const result = await APIRequest("http://localhost:8081/logout", updateOptions)
  if (result) {
    console.log(result)
  }
  setLogger(!logger)
  setAuthorised(false)
  }

  return (
    <nav className='navigation'>
        <ul className='navUl'>
            <li><button onClick={() => setOptions("Active")}>Active ToDoes</button></li>
            <li><button onClick={() => setOptions("Completed")}>Completed ToDoes</button></li>
            <li><button onClick={() => setOptions("Create")}>Create a ToDo</button></li>
            <li><button onClick={() => setOptions("Achievements")}>Achievements</button></li>
            <Link to='/login'><li><button onClick={logout}>Exit</button></li></Link>
        </ul>
    </nav>
  )
}

export default Nav