import './stacksRightBar.css';
import capitalize from '../../../../utils/capitalize';
import { useEffect, useState } from 'react';
import StackInfoSection from './Components/StackInfoSection';


const StacksRightBar = ({ selectedStack }) => {
    const users = selectedStack?.users;
    const companies = selectedStack?.companies;
    const posts = selectedStack?.posts;
    const softwares = selectedStack?.softwares;
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='company-info pt-0' style={{ width:240, maxHeight: '100%', overflow: 'auto'}}>
    <div className="card" style={{position:'fixed', width:240}}>
      <div className="card-header">
              <h4 className="mb-0">{selectedStack.name ? `${capitalize(selectedStack.name)} info:` : 'Stack info:'}</h4>
              {window.innerWidth < 992 ?
                <div onClick={() => setIsOpen(!isOpen)} style={{ height: '40px' }}>
                  {
                    isOpen ? 
                      <i className="bi bi-caret-down rounded-5 mt-1 btn-toggle-up-down" style={{height:'20px', width:'20px'}}></i> 
                      : 
                      <i className="bi bi-caret-up mt-1 rounded-5 btn-toggle-up-down" style={{height:'20px', width:'20px'}}></i>
                  }
                </div> 
                :
                <div></div>
              }
            </div> 
            <StackInfoSection objList={users} title='Users'/>
            <StackInfoSection objList={companies} title='Companies'/>
            <StackInfoSection objList={softwares} title='Softwares'/>
            <StackInfoSection objList={posts} title='Posts'/>
          <div className='mt-3'></div>
          </div>
        </div>
  );
};

export default StacksRightBar;