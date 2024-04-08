import './softwareRightBar.css';
import{ useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StacksCard from '../../../People/RightBar/Cards/StacksCard';
import { fetchCompanies } from '../../../../../utils/fetchData';
import EditableDropDown from '../../../../subComponents/EditableDropDown';

export default function SoftwareRightBar({canEdit, editingFields, setEditableFields, editableFields, handleFieldBlur, handleFieldEdit}) {
    const [companies, setCompanies] = useState();  
    const { isLoading, data, status, isFetched } = useQuery({
        queryKey: ['fetch-companies'],
        queryFn: fetchCompanies,
      });
      useEffect(() => {
        if (isFetched === true) {
          setCompanies(data);
        }
      }, [data, status]);

    if (isLoading){
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div className='software-info pt-0' style={{ width:240, maxHeight: '100%', overflow: 'auto'}}>
              <div className="card Company">
                <div className="card-header">
                  <h6 className="mb-1">Produced by:</h6>
                  <div className='d-flex justify-content-start mt-2'>
                  <EditableDropDown objList={companies} editingField={editingFields.company && canEdit && true} setEditableFields={setEditableFields} fieldToEdit={'company'} field={editableFields.company} handleFieldEdit={handleFieldEdit} displayValue={editableFields.company.name} handleFieldBlur={handleFieldBlur} tag={'h4'} w={'180px'}/>
                  </div>

                </div>
              </div>
              <div className="card SoftwareRightBar">
              <StacksCard  handleFieldBlur={handleFieldBlur} 
                           field={editableFields.stacks} 
                           setEditableFields={setEditableFields} 
                           Tag={'h5'} 
                           canEdit={canEdit}/>
              </div>

            </div>
      </div>
    );
  }