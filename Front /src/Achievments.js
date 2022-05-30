import React from 'react'

const Achievments = ({user, worldEater}) => {

  return (
    <ul className='achievmentsUl'>
        {user.user_completed > 0 &&
        <li>
            <img src='/images/achievement.png' alt='achievment'/>
            "The beginner": Complete your first to do
        </li>
        }
        {user.user_completed >= 50 &&
        <li>
            <img src='/images/quality.png' alt='quality'/>
            "Hard worker": Complete 50 to does
        </li>
        }
        {user.user_completed >= 100 &&
        <li>
        <img src='/images/badge.png' alt='badge'/>
            "Doing great!": Complete 100 to does!
        </li>
        }
        {user.user_score >= 24000 &&
        <li>
            <img src='/images/success.png' alt='success'/>
            "A F-in legend, bro!": Get a Legend rank!
        </li>
        }
        {worldEater &&
        <li>
            <img src='/images/trophy.png' alt='trophy'/>
            "How the hell did we get there?": Destroy the world!
        </li>
        }
        {2 < 1 &&
        <li>
            <img src='/images/achievement-2.png' alt='achievement-2'/>
            "Time managment": Have a todo unfinished for a month or lohger
        </li>
        }
    </ul>
  )
}

export default Achievments