import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AddStack from '../models/addStack';
import capitalize  from '../../../../utils/capitalize';
import StackCard from '../../../subComponents/StackCard';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { handleLocalStorage } from '../../../../utils/fetchData';

const StacksTable = ({displayStack}) => {
  const user = JSON.parse(localStorage.getItem('user_data'))
  let stackList = JSON.parse(localStorage.getItem('stackList'))
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [stacks, setStacks] = useState([]);
  
  useEffect(() => {
    if (!stackList){
    handleLocalStorage({ setObject: setStacks, data: stackList, storageName: 'stackList', endpoint: '/api/stack/list'});
    }
    else{
      setStacks(stackList);
    }
  }, []);

  const [expandedType, setExpandedType] = useState({
    devops: false,
    frontend: false,
    backend: false,
    database: false,
  });
  
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="row justify-content-between">
          {user.is_superuser ?
            <div>
              <button onClick={() => setModalIsOpen(true)} className="col-3 btn btn-secondary btn-sm">Add Stack</button>
              <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
                className='d-flex flex-column justify-content-center align-items-center'
                style={{
                  content: {
                    width: '350px',
                    height: '350px',
                    margin: 'auto',
                    marginTop: '150px',
                    position: 'relative'
                  }
                }}>
                <button onClick={() => setModalIsOpen(false)} className='btn btn-outline-secondary'
                  style={{ position: 'absolute', top: '5px', right: '10px', padding: '0px 5px 0px 5px' }}><strong>X</strong></button>
                <AddStack />
              </Modal>
            </div>
            :
            <div className="col-2"></div>}
        </div>
      </div>
      <div className="card-body">
        <div className="mt-2 d-flex flex-column align-items-start justify-content-between">
          {
            ["frontend", "backend", "database", "devops"].map(type => {
              const filteredStacks = stacks.filter(stack => stack?.type.toLowerCase() === type.toLowerCase());
              return (
                <div key={type} className='w-100'>
                  <div className="d-flex flex-row justify-content-between align-items-center mb-3 w-100 border border-secondary border-top-0 border-start-0 border-end-0 m-0 p-0" style={{ width: '100%' }}>
                    <h3 style={{ width: '200px' }} >{capitalize(type)}</h3>
                    <div style={{ width: '30px' }} className="me-0" onClick={() => setExpandedType(prevState => ({ ...prevState, [type]: !prevState[type] }))}>{expandedType[type] ? <i className="bi bi-caret-down w-100 me-0"></i> : <i className="bi bi-caret-up w-100"></i>}</div>
                  </div>
                  <div className="d-flex flex-row flex-wrap justify-content-around align-items-center gap-2 mb-3" style={{ height: expandedType[type] ? 'auto' : '0', overflow: 'hidden' }}>
                    {filteredStacks.map((stack) => (
                      <div key={stack.uid} onMouseOver={() => displayStack(stack)}>
                        <StackCard key={stack.uid} stack={stack}/>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default StacksTable;