import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validation, setValidation] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const submitDemoUser = (e) => {
    e.preventDefault;
    return dispatch(sessionActions.login({ 
      credential:"Demo-lition", 
      password:"password" 
    })).then(closeModal);
  }

  useEffect(() => {
    if (credential.length < 4)
      setValidation(state => ({...state, cred: "Username must be at least 4 characters long"}))
    else if (validation.cred) {
      const newValid = {...validation};
      delete newValid.cred;
      setValidation(newValid);
    }
  }, [credential, setValidation]);
  useEffect(() => {
    if (password.length < 6)
      setValidation(state => ({...state, pass: "Password must be at least 6 characters long"}))
      else if (validation.pass) {
        const newValid = {...validation};
        delete newValid.pass;
        setValidation(newValid);
      }
  }, [password, setValidation]);

  return (
    <>
      <form id="LoginForm" onSubmit={handleSubmit}>
        <h1>Log In</h1>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder='Username or Email'
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        <button disabled={Object.values(validation).length != 0} type="submit">Log In</button>
        <h3 className='green' onClick={submitDemoUser}>Demo User</h3>
      </form>
    </>
  );
}

export default LoginFormModal;