import React from 'react'

const ToDo = ({Todo, options, handleStatus}) => {

  return (
    <li className='SingleToDo'>
        <label style={options === "Active" ? null : {textDecoration: "line-through"}}>{Todo.todo_name}</label>
        {options === "Active" &&
        <input className='CompletedButton' type="button" value="Completed" onClick={() => handleStatus(Todo.todo_id)}/>
        }
    </li>
  )
}

export default ToDo