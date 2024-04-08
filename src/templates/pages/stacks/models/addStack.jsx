import { useState } from 'react';
import baseUrl from '../../../baseUrl';

const AddStack = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stackType, setStackType] = useState('');
  const [message, setMessage] = useState('');
  const bUrl = baseUrl()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set('name', name)
    data.set('description', description)
    data.set('stack_type', stackType)
    data.set('image', image)

    const jwt_token = localStorage.getItem('jwt_token');
    const storageData = JSON.parse(localStorage.getItem('data'));   
    const response = await fetch(bUrl + '/api/stack/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: data,
    });
    if (response.status === 200) {
      response.json().then(data => {
      storageData.stackList.push({uid: data.uid, name: data.name, type:data.type, image:data.image});
      localStorage.setItem('data', JSON.stringify(storageData));
      });
      setMessage('User added successfully')
    } else {
      let response_data = await response.json()
      setMessage(response_data.detail)
    }
  };
  return (
    <>
    <div className='border border-primary rounded p-5' style={{backgroundColor: '#212529'}}>
    <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center' >
    <div className="input-group input-group-sm mb-3 d-flex flex-column justify-content-center align-items-center gap-2">
        <input type="text" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        defaultValue={name} onChange={(e) => setName(e.target.value)}  placeholder="Stacks's Name"/>
        <textarea type="text" style={{width:250, height:100}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        defaultValue={description} onChange={(e) => setDescription(e.target.value)}  placeholder="Stacks's Description"/>
        <input type="text" style={{width:250}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
        defaultValue={image} onChange={(e) => setImage(e.target.value)}  placeholder="Stack image url"/>
        <select className='form-select form-select-sm' style={{width:250}}
            placeholder='Type'
            onChange={(event) => {
              setStackType(event.target.value);
            }}
          >
          <option value="backend">Backend</option>
          <option value="database">Database</option>
          <option value="devops">Devops</option>
          <option value="frontend">Frontend</option>
        </select>
          
    </div>
      <button type="submit" className="btn btn-outline-primary" >Add Stack</button>
      {message && <p>{message}</p>}
    </form>
    </div>
    </>
  );
};

export default AddStack;