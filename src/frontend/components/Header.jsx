import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import gravatar from '../utils/gravatar'
import { logoutRequest } from '../app/moviesReducer'

import '../assets/styles/components/Header.scss'
import logo from '../assets/static/logo-platzi-video-BW2.png'
import userIcon from '../assets/static/user-icon.png'

const Header = ({ isHome }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const hasUser = Object.keys(user).length > 0

  const handleLogout = () => {
    document.cookie = 'id='
    document.cookie = 'name='
    document.cookie = 'email='
    document.cookie = 'token='
    dispatch(logoutRequest({}))
    navigate('/login')
  }

  return (
    <header className='header'>
      <Link to='/'>
        <img className='header__img' src={logo} alt='Platzi Video' />
      </Link>
      {isHome &&
        (
          <div tabIndex={0} className='header__menu'>
            <div className='header__menu--profile'>
              {hasUser
                ? (
                  <img src={gravatar(user.email)} alt={user.name} />
                  )
                : (
                  <img src={userIcon} alt='Gravatar User' />
                  )}
              <p>Perfil</p>
            </div>
            <ul>
              {hasUser
                ? (
                  <>
                    <li>
                      <Link to='/'>{user.name}</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Cerrar Sesión</button>
                    </li>
                  </>
                  )
                : (
                  <li>
                    <Link to='/login'>Iniciar Sesión</Link>
                  </li>
                  )}
            </ul>
          </div>
        )}
    </header>
  )
}

export default Header
