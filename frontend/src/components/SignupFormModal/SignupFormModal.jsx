import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({firstName: "First name can't be empty"});
  const { closeModal } = useModal();

  // Button Validations 
  useEffect(() => {
    if (firstName === "") setValidations({...validations, firstName: "First name can't be empty"})
    else if (validations.firstName) {
      const newValid = {...validations};
      delete newValid.firstName;
      setValidations(newValid);
    }
  }, [firstName, setValidations])
  useEffect(() => {
    if (lastName === "") setValidations({...validations, lastName: "Last name can't be empty"})
    else if (validations.lastName) {
      const newValid = {...validations};
      delete newValid.lastName;
      setValidations(newValid);
    }
  }, [lastName, setValidations])
  useEffect(() => {
    if (username.length < 4) setValidations({...validations, username: "Username must be longer than 3 characters"})
    else if (validations.username) {
      const newValid = {...validations};
      delete newValid.username;
      setValidations(newValid);
    }
  }, [username, setValidations])
  useEffect(() => {
    if (password.length < 6) setValidations({...validations, password: "Password must be longer than 5 characters"})
    else if (confirmPassword !== password) setValidations({...validations, password: "Passwords must match"})
    else if (validations.password) {
      const newValid = {...validations};
      delete newValid.password;
      setValidations(newValid);
    }
  }, [password, confirmPassword, setValidations])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          firstName,
          lastName,
          email,
          username,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Passwords must match"
    });
  };

  return (
    <>
      <form id="SignUpForm" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {errors && Object.values(errors).map((error, id) => <p key={id}>{error}</p>)}
        <label>
          <input
            type="text"
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button 
          disabled={Object.values(validations).length != 0}
          type="submit"
          >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;