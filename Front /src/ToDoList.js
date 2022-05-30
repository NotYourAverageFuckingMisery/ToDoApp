import React, { useEffect } from 'react'
import ToDo from './ToDo'

const ToDoList = ({toDoes, options, handleStatus, setWorldEater}) => {

    let completedTodoes = []
    let activeTodoes = []

    if (toDoes!== undefined && toDoes !== null) {

    for (let i = 0; i < toDoes.length; i++) {
        if (toDoes[i].todo_status === false) {
            activeTodoes.push(toDoes[i])
        } else {
            completedTodoes.push(toDoes[i])
        }
       
    }
    
    }

    useEffect(() => {
        for (let i = 0; i < completedTodoes.length; i++) {
            if ((completedTodoes[i].todo_name).toLowerCase() === "destroy the world") {
                setWorldEater(true)
            }
        }
    })

   

    let resultMap = []
    let writing
    if (options === "Active") {
        resultMap = activeTodoes
        writing = "My active todoes:"
    } else if (options === "Completed") {
        resultMap = completedTodoes
        writing = "My completed todoes:"
    }

    if (toDoes !== undefined && toDoes !== null) {
  return (
    <div>
        <h3 className='secHeader'>{writing}</h3>
        <ul className='toDoList'>
            {resultMap.map((Todo) => (
                <ToDo 
                key={Todo.todo_id}
                Todo={Todo}
                options={options}
                handleStatus={handleStatus}/>
            ))}
        </ul>
    </div>
  )
} else {
    return (
        <div>
            {options === "Active" ? 
            <h3 className='secHeader'>You have no active todoes!</h3> : 
            <h3 className='secHeader'>You have no completed todoes!</h3>}
        </div>
    )
}
}

export default ToDoList
