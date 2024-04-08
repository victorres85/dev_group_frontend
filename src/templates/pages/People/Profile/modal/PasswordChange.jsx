import { useState } from 'react';
import baseUrl from '../../../../baseUrl';
import PropTypes from 'prop-types';

const PasswordChange = ({ setModalIsOpen }) => {
  PasswordChange.propTypes = {
    setModalIsOpen: PropTypes.func.isRequired,
  };
  
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const bUrl = baseUrl()

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(bUrl+'/api/auth/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
        password: password,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      setMessage('Password changed successfully.');
      setModalIsOpen(false)
    } else {
      setMessage(data.detail);
    }
  };

  return (
    <div className='border border-primary rounded p-5' style={{backgroundColor: '#212529'}}>
    <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center' >
    <div className="input-group input-group-sm mb-3 d-flex flex-column justify-content-center align-items-center gap-2">
        <input type="password" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Current Password"/>
        <input type="password" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  placeholder="New Password"/>
         <input type="password" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password"/>
    </div>
      <button type="submit" className="btn btn-outline-primary">Change Password</button>
      {message && <p>{message}</p>}
    </form>
    </div>
  );
};

export default PasswordChange;