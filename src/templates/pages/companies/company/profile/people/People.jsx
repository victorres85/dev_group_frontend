
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { AddButton, RemoveButton } from '../../../../../subComponents/Buttons';
import capitalize from '../../../../../../utils/capitalize';


const People = ({canEdit, setEditableFields, editableFields, users}) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const handleRemove = (indexToRemove) => {
        setEditableFields(prevFields => ({
          ...prevFields,
          users: prevFields.users.filter((user) => !(user.uid === indexToRemove))
        }));
  };

  const handleAddPerson = (user) => {
    setEditableFields(prevFields => {
      const userList = prevFields.users || [];
      return {
        ...prevFields,
        users: [...userList, user]
      };
    });
    setSelectedPerson(null)
    setSelectedOption("");
  };


  return (
    <div>
          <div className="card staff">
            <div className="card-header d-flex flex-row justify-content-between align-items-middle">
              <h4 className="mb-0 ms-1">People</h4>
              {canEdit &&
                <div className='d-flex flex-row justify-content-start align-items-center'>
                  <select className="form-select form-select-sm"
                    value={selectedOption}
                    style={{ maxWidth: 250 }}
                    onChange={(event) => {
                      const sPerson = users.find(us => us.name === event.target.value);
                      setSelectedOption(event.target.value);
                      setSelectedPerson(sPerson ? sPerson : null);
                    }}
                  >
                    <option value="">Add User</option>
                    {users
                      .filter((ul) => !editableFields.users.some(user => user?.uid === ul.uid))
                      .map((s) => (
                        <option key={s.uid} value={s.name}>{capitalize(s.name)}</option>
                      ))}
                  </select>
                  <div className="ms-3 mt-0">
                    <AddButton onClick={() => { handleAddPerson(selectedPerson) }}></AddButton>
                  </div>
                </div>
              }
            </div>
            <div className="card-body d-flex flex-column">
              <div className="d-flex flex-row flex-wrap justify-content-around align-items-center">
                {editableFields.users.map((employee) => (
                  <React.Fragment key={employee.uid}>
                    {!canEdit ?
                      <Link key={employee.uid} to={`/people/${employee.uid}`} style={{ width: '30%', minWidth: '180px', minHeight: '252px' }}>
                        <div className="card border-bottom border-0 border-4 shadow-sm border-primary" style={{ minHeight: '252px' }}>
                          <div className="card-body text-center" >
                            <div className="profile-img rounded-circle" style={{ height: 100 }}>
                              {employee.picture &&
                                <img src={employee.picture} className="rounded-circle p-1 bg-primary" style={{ width: 100, height: 100 }} alt={employee.name} />
                              }
                            </div>
                            <div className="mt-4">
                              <h5 className="mb-1">{employee.name}</h5>
                              <p className="mb-0">{employee.role}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      :
                      <div key={employee.uid} className="unstyled" style={{ width: '30%', minWidth: '180px', minHeight: '252px' }}>
                        <div className="card border-bottom border-0 border-4 shadow-sm border-primary" style={{ minHeight: '252px' }}>
                          <RemoveButton onClick={() => { handleRemove(employee.uid) }} />
                          <div className="card-body text-center">
                            <div className="profile-img" style={{ width: 100, height: 100 }}>
                              <img src={employee.picture} className="rounded-circle p-1 bg-primary" style={{ width: 100, height: 100 }} alt={employee.name} />
                            </div>
                            <div className="mt-4">
                              <h5 className="mb-1">{employee.name}</h5>
                              <p className="mb-0">{employee.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    }

                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
    </div> 
  );
}

export default People;