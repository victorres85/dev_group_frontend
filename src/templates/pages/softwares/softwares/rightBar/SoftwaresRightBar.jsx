import './softwareRightBar.css';
import capitalize from '../../../../../utils/capitalize';
import { useState } from 'react';
import DefaultInfoSection from '../../../../subComponents/DefaultInfoSection';
import InfoSectionForStacks from '../../../../subComponents/InfoSectionForStacks';

const SoftwaresRightBar = ({ selectedSoftware }) => {
    const users = selectedSoftware?.users;
    const stacks = selectedSoftware?.stacks;
    const softwares = selectedSoftware?.softwares;
    const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div className='company-info pt-0' style={{ width:240, maxHeight: '100%', overflow: 'auto'}}>
    <div className="card">
            <div className="card-header d-flex flex-row justify-content-between align-items-center mb-0">
              <h4 className="mb-0" style={{lineHeight:'36px'}}>{selectedSoftware?.name ? `${capitalize(selectedSoftware.name)} info:` : 'Company info:'}</h4>
                <div onClick={() => setIsOpen(!isOpen)} style={{ height: '40px' }}>
                </div> 
            </div> 
            {users && users.length > 0 && <DefaultInfoSection objList={users} title='Users'/>}
            {softwares && softwares.length > 0 && <DefaultInfoSection objList={softwares} title='Softwares'/>}
            {stacks && stacks.length > 0 && <InfoSectionForStacks objList={stacks} title='Stacks'/>}
            {/* <h3 className='mt-2 ms-3 mb-0'>Stacks</h3>
            { stacks &&
              Object.entries(stacks.reduce((grouped, stack) => {
                (grouped[stack.type] = grouped[stack.type] || []).push(stack);
                return grouped;
              }, {})).map(([type, stacks]) => (
                <div key={type} className="card-body p-0 ps-3 pt-2 mb-0 ms-3 mt-0">
                  <h5 className='pt-2'>{capitalize(type)}</h5>
                  <ul className="list-unstyled mb-0 pb-0">
                    {stacks.map((stack, index) => (
                      <li key={index} className='ms-3 mb-0'>
                        <i className={getIconClass(type)}></i>
                        <strong className='mb-0'>{capitalize(stack.name)}</strong>
                      </li>
                    ))}
                  </ul>
                </div> 
              ))
            } */}


            
          <div className='mt-3'></div>
          </div>
        </div>
  );
};

export default SoftwaresRightBar;