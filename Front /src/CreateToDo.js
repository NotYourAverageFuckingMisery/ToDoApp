import React, { useRef } from 'react'

const CreateToDo = ({handleSubmit, setDifficulty, newItem, setNewItem}) => {
    const inputRef = useRef()
  return (
    <form className='AddTodo' onSubmit={handleSubmit}>
        <label><h3 className='secHeader'>Create ToDo:</h3></label>
        <div className='AddForm'>
          <input
          className='AddFormItem'
          autoFocus
          ref={inputRef}
          id="createToDoInput"
          type='text'
          placeholder='Add todo'
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          >

          </input>
          <select onChange={(e) => setDifficulty(e.target.value)} className='AddFormItem'>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
          </select>
          <button className='AddFormItem' type='submit' aria-label='Create a ToDo' onClick={() => inputRef.current.focus()}>Submit</button>
        </div>
    </form>
  )
}

export default CreateToDo