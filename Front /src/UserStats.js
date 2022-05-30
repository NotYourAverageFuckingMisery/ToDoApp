import React, { useEffect, useState } from 'react'

const UserStats = ({user}) => {

const [level, setLevel] = useState(0)
const score = user.user_score
const [rank, setRank] = useState("")

useEffect(() => {
  if (score >= 100 & score <= 1000){
    setLevel((score - score % 100) / 100)
  } else if (score > 1000 & score <= 9000) {
    setLevel(10 + (((score - 1000) - score % 200) / 200))
  } else if (score > 9000) {
    setLevel(50 + (((score - 9000) - score % 300) / 300))
  }
}, [score])

useEffect(() => {
  if (level < 10) {
    setRank("Novice")
  } else if (level < 20 && level >= 10) {
    setRank("Apprentice")
  } else if (level < 30 && level >= 20) {
    setRank("Adept")
  } else if (level < 50 && level >= 30) {
    setRank("Expert")
  } else if (level < 100 && level >= 50) {
    setRank("Master")
  } else if (level >= 100) {
    setRank("Legend")
  }
}, [level])



  return (
    <header className='userStats'>
        <h2 className='mainHeader'>Hello, {user.user_name}!</h2>
        <ul className='statsList'>
            <li>Your level: {level}</li>
            <li>Tasks completed: {user.user_completed}</li>
            <li>Your rank: {rank}</li>
        </ul>
    </header>
  )
}

export default UserStats