import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  const viewMyGroups = (e) => {
    e.preventDefault();
    closeMenu();
    navigate("/my-groups")
  }
  const viewMyEvents = (e) => {
    e.preventDefault();
    closeMenu();
    navigate("/my-events")
  }
  const viewGroups = (e) => {
    e.preventDefault();
    closeMenu();
    navigate("/groups")
  }
  const viewEvents = (e) => {
    e.preventDefault();
    closeMenu();
    navigate("/events")
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return user ? (
    <>
      <NavLink to="/groups/new" className="green">Start a new Group</NavLink>
      <div className='profile-button' onClick={toggleMenu}>
        <i className="fa-regular fa-user" />
        <i className={`fa-solid fa-chevron-${showMenu ? "up grey" : "down"}`} />
      </div>
      <ul className={ulClassName} ref={ulRef}>
        <span>
          <div>
            <li>Hello, {user.firstName}</li> 
            <li>{user.email}</li>
          </div>
        </span>
        <span>
          <div className='hover' onClick={viewMyGroups}>
            <li>My Groups</li>
          </div>
          <div className='hover' onClick={viewMyEvents}>
            <li>My Events</li>
          </div>
        </span>
        <span>
          <div className='hover' onClick={viewGroups}>
            <li>View Groups</li>
          </div>
          <div className='hover' onClick={viewEvents}>
            <li>View Events</li>
          </div>
        </span>
        <span className='hover' onClick={logout}>
          <div>
            <li>Log Out</li>
          </div>
        </span>
      </ul>
    </>
  ) : (
  <>
    <OpenModalMenuItem
      itemText="Log In"
      modalComponent={<LoginFormModal />}
    />
    <OpenModalMenuItem
      itemText="Sign Up"
      modalComponent={<SignupFormModal />}
    />
  </>
  ) ;
}

export default ProfileButton;