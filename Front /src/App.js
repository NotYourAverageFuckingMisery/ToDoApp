import {
  Route,
  Routes
} from "react-router-dom";
import { useEffect, useState } from "react";
import ToDoList from "./ToDoList";
import Nav from "./Nav";
import CreateToDo from "./CreateToDo";
import APIRequest from "./APIrequest";
import UserStats from "./UserStats";
import Login from "./Login";
import Register from "./Register";
import Missing from "./Missing";
import PrivateOutlet from "./PrivateOutlet";
import Achievments from "./Achievments";


function App() {

  const URL = 'http://localhost:8081/todoes'

  const [toDoes, setToDoes] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [options, setOptions] = useState("Active")
  const [difficulty, setDifficulty] = useState("Easy")
  const [newItem, setNewItem] = useState("")
  // changing state of event triggers useEffect hook on line 21. i add setEvent(!event) when you want to trigger useEffect and update data
  const [event, setEvent] = useState(true)

  const [user, setUser] = useState([])
  const [logger, setLogger] = useState(false)

  const [authorised, setAuthorised] = useState(false)

  const [worldEater, setWorldEater] = useState(false)
  

  useEffect(() => {
   const fetchUser = async () => {
      fetch("http://localhost:8081/user", {
        headers: {'Content-Type' : 'application/json'},
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => setUser(data))
   }
   setTimeout( () => {
     (async () => await fetchUser())();
   }, 0)
  }, [logger, event])

  useEffect(() => {
    const fetchToDoes = async () => {
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: user.user_id})
    })
    .then(response => response.json())
    .then(data => setToDoes(data))
    .catch((err) => setFetchError(err))
    setIsLoading(false)
  }
  setTimeout( () => {
    (async () => await fetchToDoes())();
  }, 10)
}, [event, user.user_id])

const AddToDo = async (todo_name, difficulty) => {
  let todo_complexity
  let user_id = user.user_id 
  switch (difficulty) {
    case "Easy":
    todo_complexity = 1
    break
    case "Medium":
    todo_complexity = 2
    break
    case "Hard":
    todo_complexity = 3
    break
    default:
    break
  }
  const NewToDo = {todo_name, todo_complexity, user_id}
  const postOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(NewToDo)
  }
  const result = await APIRequest(URL, postOptions)
  if (result) setFetchError(result)
  setEvent(!event)
}

const handleSubmit = (e) => {
  e.preventDefault()
  if (!newItem) return
  AddToDo(newItem, difficulty)
  setNewItem('')
}

const handleStatus = async (id) => {
  const updatedToDo = toDoes.filter((todo) => todo.todo_id === id)
  const updateOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ todo_id: updatedToDo[0].todo_id})
  }
  const result = await APIRequest(URL, updateOptions)
  if (result) setFetchError(result)


  const updateOptions2 = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: updatedToDo[0].user_id, score: user.user_score + updatedToDo[0].todo_complexity * 10, completed: user.user_completed + 1})
  }
  const result2 = await APIRequest("http://localhost:8081/userscore", updateOptions2)
  if (result2) setFetchError(result2)


  setEvent(!event)
}

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PrivateOutlet authorised={authorised}/>}>
          <Route path="/" element={<>
          <main>
            <Nav options={options} setOptions={setOptions} setLogger={setLogger} logger={logger} setAuthorised={setAuthorised}/>
            <UserStats user={user}/>
            {isLoading && <h1>Loading todoes</h1>}
            {!fetchError && !isLoading && options !== "Create" && options !== "Achievements" &&
            <div>
              <ToDoList toDoes={toDoes} options={options} handleStatus={handleStatus} setWorldEater={setWorldEater}/>
            </div>
            }
            {!fetchError && !isLoading && options === "Create" &&
            <div>
              <CreateToDo handleSubmit={handleSubmit} setDifficulty={setDifficulty} newItem={newItem} setNewItem={setNewItem}/>
            </div>
            }
            {!fetchError && !isLoading && options === "Achievements" &&
            <div>
              <Achievments user={user} worldEater={worldEater}/>
            </div>
            }
          </main>
          </>}/>
        </Route>
        <Route path="/login" element={<><Login setLogger={setLogger} logger={logger} setAuthorised={setAuthorised}/></>} />
        <Route path="/register" element={<Register/>} />
        <Route path="*" element={<Missing/>} />
      </Routes>
    </div>
  );
}

export default App;
