import { useState, useEffect } from 'react';
import baseUrl from '../baseUrl';
import Loading from './Loading';
import { fetchPosts, fetchData } from '../../utils/fetchData';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bUrl = baseUrl();

  var jwt_token = localStorage.getItem('jwt_token'); 
  var data = null;
  try {
    data = JSON.parse(localStorage.getItem('data'))
  }
  catch{
    data = null
  }
  if (jwt_token && data) {
    var url = bUrl + '/api/user/list';
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
    .then(response =>response.json())
    .catch(error => {
      console.lor('Error: ', error)   
    })
    }
    
    useEffect(() => {
      if (jwt_token) {
        window.location.href = '/dashboard';
      }
    }, []);

    const handleFetchPosts = async () => {
      try{
        let data = await fetchPosts(0, 20);
        console.log('Data fetched: ', data);
        localStorage.setItem('posts', JSON.stringify(data));
      } catch (error) {
        console.error('Error:', error);
      }
    }

    const handleFetchData = async () => {
      try{
        let data = await fetchData('/api/user/list')
        console.log('Data fetched: ', data);
        localStorage.setItem('userList', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Error:', error);
      }
    }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    fetch(bUrl + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET`
  }).then(response => response.json()).
  then(async (data) => {
    const jwt_token = await data.access_token;
    localStorage.setItem('jwt_token', jwt_token);
    localStorage.setItem('user_data', JSON.stringify(data.data));
    await handleFetchPosts()
    await handleFetchData()
    window.location.href = '/dashboard';
  }).catch(
      (error) => {
        setIsLoading(false);
        console.error('error :', error);
        setErrorMessage('Invalid username or password. Please try again.');
  });
  }


  const handleGoogleLogin = () => {
    window.open(bUrl + '/api/auth/google_login', '_blank');
  }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={{maxHeight:600, maxWidth:900}}>
      <div style={{height:40, width:300}} className='mb-5'>
        {isLoading && <Loading style={{transform:'scale(0.3)'}}/>}
      <div className={ `alert alert-dark d-flex justify-content-center align-items-center ${errorMessage && !isLoading? '' : 'd-none'}`} role='alert'>{errorMessage}</div>
      </div>
    <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center'>
      <div className="input-group input-group-sm mb-3 d-flex flex-column justify-content-center align-items-center gap-2">
        <input type="text" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>

        <input type="password" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" 
        value={password} onChange={(e) => setPassword(e.target.value)}placeholder="Password"/>
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center gap-3'>
      <button type="submit" className="btn btn-outline-primary">Login</button>
      <button type="button" className="btn btn-outline-secondary" onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </form>
    </div>
  );
};

export default LoginComponent;
