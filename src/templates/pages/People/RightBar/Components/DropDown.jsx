import { useEffect, useState } from 'react';
import capitalize from '../../../../../utils/capitalize';
import { AddButton } from '../../../../subComponents/Buttons';

function DropDownObjects({ objList, field, type, handleAction, useAddBtn, w, displayValue}) {
    const [selectedUid, setSelectedUid] = useState(''); 
    var iterable;
    if (type === 'stack'){
        iterable = objList?.filter((st) => st.type === type && !field?.some(ef => ef?.uid === st.uid))
    }else{
        iterable = objList
    }
    if (typeof displayValue !== 'string'){
      displayValue = false
    }


    useEffect(() => {
      if (!useAddBtn && selectedUid){
        handleAction(selectedUid);
      }
    }, [selectedUid]);
  
    return (
    <div className={`d-flex flex-row justify-content-start align-items-center mb-4 mt-2`}  id="addingNewStack">
      <select className={`form-select form-select-sm p-0 ps-2 mb-0`}
        style={{height: '26px', width: w? w : '120px'}}
        onChange={(event) => {
          const selectedStack = objList?.find(obj => obj.name === event.target.value);
          setSelectedUid(selectedStack ? selectedStack : null);
        }}
      >
        <option style={{height:0}} value=""></option>
        {iterable && iterable.map((st) => {
            if (displayValue && st.name.toLowerCase() === displayValue.toLowerCase()) {
              return <option key={st.uid} value={st.name} selected>{capitalize(st.name)}</option>;
            } else if (displayValue && st.name.toLowerCase() !== displayValue.toLowerCase()) {
              return <option key={st.uid} value={st.name}>{capitalize(st.name)}</option>;
            } else if (!displayValue) {
              return <option key={st.uid} value={st.name}>{capitalize(st.name)}</option>;
            }
        })}
      </select>
      {useAddBtn ?
      <div className="ms-3">
        <AddButton onClick={() => {if(selectedUid) {handleAction(selectedUid);}}}/>
      </div>  
      : <p></p>
      }
    </div>
  );
}

export default DropDownObjects;