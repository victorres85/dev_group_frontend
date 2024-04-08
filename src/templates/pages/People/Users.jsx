import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import capitalize  from '../../../utils/capitalize';
import { handleLocalStorage } from '../../../utils/fetchData';
import Modal from 'react-modal';
import AddUser from './models/addUser';


function UserTable() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [superuser, setSuperuser] = useState(false);
  const userList = JSON.parse(localStorage.getItem('userList'))
  const user = JSON.parse(localStorage.getItem('user_data'))
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user.is_superuser){
      setSuperuser(true)
    }
  }, [user.is_superuser]);


  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function shuffleUsers(users) {
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }
    return users;
  }

  const filteredUsers = shuffleUsers(users).filter(user => {
  if (filterType === 'all') {
    return true;
  } else if (filterType === 'by_company' && user.company.name !== null) {
    return user.company.name.toLowerCase().includes(searchTerm.toLowerCase());
  } else if (filterType === 'by_role' && user.role) {
    return user.role.toLowerCase().includes(searchTerm.toLowerCase());
  } else if (filterType === 'by_stack' && Array.isArray(user.stacks)) {
    return user.stacks.some(stack => stack.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  return false;
});
  
  useEffect(() => {
    if (!user){
      window.location.href = '/logout';
    }
    handleLocalStorage({ setObject: setUsers, data: userList, storageName: 'userList', endpoint: '/api/user/list'});
  },[]);
console.log('users: ',users)
    return (
      <>
      <div className="card">
        <div className="card-header">
          <div className="row justify-content-between">
            {superuser ?
            <>
            <button onClick={() => setModalIsOpen(true)} className="col-2 btn btn-secondary btn-sm">Add User</button>
            <Modal isOpen={modalIsOpen} onRequestClose={() => window.open('index.html')}
              className='d-flex flex-column justify-content-center align-items-center'
              style={{
                content: {
                  width: '350px',
                  height: '350px',
                  margin: 'auto',
                  marginTop:'100px',
                  position:'relative'
                }
              }}>
                  <button onClick={() => setModalIsOpen(false)} className='btn btn-outline-secondary'
                    style={{position:'absolute', top:'50px', right:'5px', padding:'0px 5px 0px 5px'}}><strong>X</strong></button>
                  <AddUser/>
            </Modal> 
            </>
            : 
            <div className="col-2"></div> }
            <div className="row col-10 justify-content-end">
              <div className="col-3 justify-content-end">
              <select className="form-select" onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="by_company">By Company</option>
                <option value="by_role">By Role</option>
                <option value="by_stack">By Stack</option>
              </select>
              </div>
              <div className="col-4 d-flex justify-content-end">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search..." onChange={handleSearchChange} />
                  <div className="input-group-append d-flex align-items-center">
                    <span className="border rounded-end p-2 search-icon">
                      <i className="bi bi-search pe-6"></i>
                    </span>
                  </div>
                </div>
              </div>
              </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-3 row-cols-xxl-4">
            {filteredUsers.map((user) => (
              <Link  key={user.uid} to={`/people/${user.uid}`} className="col d-flex align-items-stretch unstyled">
                <div className="card border-bottom border border-primary w-100 shadow-lg" style={{border:0.2}}>
                  <div className="card-body text-center">
                    <div className="profile-img" >
                      {user.picture === "/assets/img/users/questionface.jpg"? <div className='rounded' style={{width:100, height:100}}></div> :
                      <img src={user.picture} loading="lazy" className="rounded-circle p-1 bg-primary" style={{width:100, height:100}} alt={user.name} />}
                    </div>
                    <div className="mt-4">
                      <h5 className="mb-1">{capitalize(user.name ? user.name : '')}</h5>
                      <p className="mb-0">{capitalize(user.role)} {user.company ? '| ' + capitalize(user.company.name) : ''}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }
  
  export default UserTable;