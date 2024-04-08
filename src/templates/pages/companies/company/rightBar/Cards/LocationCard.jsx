
import { useState } from 'react';
import { AddButton, RemoveButton } from '../../../../../subComponents/Buttons';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';


const LocationCard = ({canEdit, setEditableFields, setMessage, editableFields}) => {
  const [newAddress, setNewAddress] = useState({
    country:'',
    city:'',
    address:'',
  })

  const handleRemove = (indexToRemove) => {
      setEditableFields(prevFields => ({
        ...prevFields,
        locations: prevFields.locations.filter((location) => !(location.address === indexToRemove))
      }));
    };

  
  const handleAddLocation = (location) => {
    if (location.country && location.city && location.address){
    setEditableFields(prevFields => {
      const locationLisrt = prevFields.locations || [];
      return {
        ...prevFields,
        locations: [...locationLisrt, location]
      };
    });
    setNewAddress(null)
    }else{
      setMessage('Address Incomplete')
    }
  };
  return (
    <div>
      {canEdit &&
        <div className='d-flex flex-row justify-content-start align-items-end'>
          <div className='d-flex flex-column justify-content-start gap-1 mt-3 mb-3 ms-3'>
            <div className='input-group input-group' style={{ maxWidth: 180 }}>
              <input type="text" className='form-control'
                defaultValue=''
                onChange={(event) => { setNewAddress(prevAddress => ({ ...prevAddress, country: event.target.value })) }}
                placeholder='Country' />
            </div>
            <div className='input-group input-group' style={{ maxWidth: 180 }}>
              <input type="text" className='form-control'
                defaultValue=''
                onChange={(event) => { setNewAddress(prevAddress => ({ ...prevAddress, city: event.target.value })) }}
                placeholder='City' />
            </div>
            <div className="form-floating">
              <textarea type="text"
                defaultValue=''
                onChange={(event) => { setNewAddress(prevAddress => ({ ...prevAddress, address: event.target.value })) }}
                className="form-control" id="floatingTextarea2" style={{ height: 100, width: 180 }}
                placeholder='Address' />
            </div>
          </div>
          <div className="ms-3 mb-3">
            <AddButton onClick={() => { handleAddLocation(newAddress) }}></AddButton>
          </div>
        </div>
      }
      <div className="card-body">
              <ul className="list-unstyled">
                {editableFields.locations.sort((a, b) => a.country.localeCompare(b.country)).map((location) => (
                  <li key={location.address} className='d-flex flex-row justify-content-start align-items-center p-0 mb-3'>
                    {canEdit ? 
                      <RemoveButton onClick={() => handleRemove(location.address, 'location')} />
                      :
                      <i className="bi bi-geo-alt-fill me-2"></i>
                    }
                    <div className='d-flex flex-column'>
                      <strong>{location.country}</strong>
                      {location.city}
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{location.address}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
    </div>
  );
};

export default LocationCard;