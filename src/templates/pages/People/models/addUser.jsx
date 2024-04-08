import { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import baseUrl from '../../../baseUrl';

const AddUser = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
//   const [company, setCompany] = useState('');
  const [joined, setJoined] = useState('');
  const [message, setMessage] = useState('');
  const bUrl = baseUrl()

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(bUrl + '/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&joined=${encodeURIComponent(joined)}`,

    });

    if (response.status === 200) {
      setMessage('User added successfully')
    } else {
      const data = await response.json();
      setMessage('Error adding user')
      console.error('Error adding user:', data.detail);
    }
  };

  return (
    <>
    <div className='border border-primary rounded p-5' style={{backgroundColor: '#212529'}}>
    <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center' >
    <div className="input-group input-group-sm mb-3 d-flex flex-column justify-content-center align-items-center gap-2">
        <input type="email" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={email} onChange={(e) => setEmail(e.target.value)} placeholder="User's Email"/>
        <input type="text" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={name} onChange={(e) => setName(e.target.value)}  placeholder="User's Name"/>
         <input type="text" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={role} onChange={(e) => setRole(e.target.value)} placeholder="User's Role"/>
        <input type="text" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={joined} onChange={(e) => setJoined(e.target.value)} placeholder="01/01/2023"/>
    </div>
      <button type="submit" className="btn btn-outline-primary">Add User</button>
      {message && <p>{message}</p>}
    </form>
    </div>
    </>
  );
};

export default AddUser;