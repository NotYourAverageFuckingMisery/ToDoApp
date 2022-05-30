import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import APIRequest from './APIrequest'

// login must be in any letters A-Z, any number and from 3 to 20 char long
const LOGIN_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/
// pass require at least one of symbols inside [ ]
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/
const NAME_REGEX = /^[a-zA-Zа-яА-Я][a-zA-Zа-яА-Я0-9_ ]{1,20}$/

const API_URL = "http://localhost:8081/register"

const Register = () => {

    //пиздец я ж запутаюсь в этой поебени
    const loginRef = useRef();
    const errRef = useRef();

    const [event, setEvent] = useState(true)

    const [sucsess, setSucses] = useState(false);

    const [logins, setLogins] = useState([]);

    const [errMsg, setErrMsg] = useState('');

    const [login, setLogin] = useState('');
    const [validLogin, setValidLogin] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    const [isAvalible, setIsAvalible] = useState(true)

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [macthPwd, setMacthPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    useEffect(() => {
        const fetchLogins = async () => {
            fetch(API_URL)
            .then(response => response.json())
            .then(data => setLogins(data.all_logins))
        }
        fetchLogins();
    }, [event])

    if (logins === null) {
        setLogins([])
    }

    useEffect(() => {
        loginRef.current.focus();
    }, [])

    
    useEffect(() => {
        const result = LOGIN_REGEX.test(login)
        setValidLogin(result)

        if (logins.includes(login)) {
            setIsAvalible(false)
        } else {
            setIsAvalible(true)
        }

    }, [login, logins])

    useEffect(() => {
        const result = NAME_REGEX.test(name)
        setValidName(result)
    }, [name])


    useEffect(() => {
        const result = PASS_REGEX.test(pwd)
        setValidPwd(result)
        const match = pwd === macthPwd
        setValidMatch(match)
    }, [pwd, macthPwd])

    useEffect(() => {
        setErrMsg('')
    }, [login, pwd, macthPwd, name])

    const handleSubmit = async (e) => {
        e.preventDefault()
        //EXTRA SECURITY
        const v1 = LOGIN_REGEX.test(login)
        const v2 = PASS_REGEX.test(pwd)
        if (!v1 || !v2) {
            setErrMsg("Invalid entry")
            return
        }
        //END OF EXTRA SECURITY
        const user_login = login
        const user_password = pwd
        const user_name = name
        const NewUser = {user_login, user_password, user_name}
        const postOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(NewUser)
          }
        const result = await APIRequest(API_URL, postOptions)
        if (result) setErrMsg(result)
        setEvent(!event)
        setSucses(true)
    }

  return (
      <> {sucsess ? (
          <section className='sucsessfulReg'>
              <h1>Sucsess!</h1>
              <h4><Link to="/">Back to log in</Link></h4>
          </section>
      ) : 
    <section className='registerSection'>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive">{errMsg}</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>

            {/* USER LOGIN VALIDATION FORM*/}

            <label htmlFor='userlogin'>
                <span className={validLogin && isAvalible ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validLogin || !login ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                <span className={isAvalible? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                Login:
            </label>
            <input
            type='text'
            id='userlogin'
            ref={loginRef}
            autoComplete='off'
            onChange={(e) => setLogin(e.target.value)}
            required
            aria-invalid={validLogin ? "false": "true" && isAvalible ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            />
            <p id='uidnote' className={userFocus && login && !validLogin ? "instructions" : "offscreen"}>
                Must contain from 4 to 20 symbols. <br/>
                Must begin with a letter.
            </p>
            <p id='uidnote' className={!isAvalible ? "instructions" : "offscreen"}>
                This login is allready taken!
            </p>

            {/* USERNAME VALIDATION FORM*/}

            <label htmlFor='username'>
                <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validName || !name ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                User name:
            </label>
            <input
            type='text'
            id='username'
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={validName ? "false": "true"}
            aria-describedby="namenote"
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            />
            <p id='namenote' className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                Must contain from 4 to 20 symbols. <br/>
                Must begin with a letter.
            </p>

            {/* USER PASSWORD VALIDATION FORM*/}

            <label htmlFor='userpassword'>
                <span className={validPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                Password:
            </label>
            <input
            type='password'
            id='password'
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? "false": "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            />
            <p id='pwdnote' className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                Must contain from 8 to 20 symbols. <br/>
                Must have at least one uncapitalised letter, <br/>
                one capitalised letter and a number.
            </p>

            {/* MATCHING PASSWORD VALIDATION FORM*/}

            <label htmlFor='confirm_pwd'>
                <span className={validMatch && macthPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validMatch|| !macthPwd ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                Confirm password:
            </label>
            <input
            type='password'
            id='confirm_pwd'
            onChange={(e) => setMacthPwd(e.target.value)}
            required
            aria-invalid={validMatch ? "false": "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            />
            <p id='confirmnote' className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                Must match the first password input field.
            </p>

            {/* Submit button. If there is only one button in <form> it is submit by default*/}

            <button disabled={!validLogin || !validName || !validPwd || !validMatch || !isAvalible ? true : false}>Sign up</button>

        </form>
        <Link to='/login'><h4>Back to log in</h4></Link>
    </section>
    }
    </>
  )
}

export default Register