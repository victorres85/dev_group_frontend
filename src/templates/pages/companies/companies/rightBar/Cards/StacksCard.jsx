import capitalize from "../../../../../utils/capitalize";
import { RemoveButton } from "../../../../subComponents/Buttons";
import { useEffect, useState} from "react";
import DropDownObjects from "../Components/DropDown";
import { handleLocalStorage } from "../../../../../utils/fetchData";

const StacksCard = ({handleFieldBlur, field, setEditableFields}) => {
  
    let stackList;
    try{
      stackList = JSON.parse(localStorage.getItem('stackList'));
    }catch (error){
        console.log(error);
    }
    const [isLoading, setIsLoading] = useState(true);
    const [stacks, setStacks] = useState(stackList);
    
    const handleAddStack = (stack) => {
        setEditableFields(prevFields => ({
          ...prevFields,
          stacks: [...prevFields.stacks, stack]
        }));
      };

    const handleRemoveStack = (indexToRemove) => {
    try {
        setEditableFields(prevFields => ({
        ...prevFields,
        stacks: prevFields.stacks.filter((st) => !(st.uid === indexToRemove))
        }));
    }
    catch (error) {
        console.log(error);
    }
    };

      useEffect(() => {
        if (!stackList){
          handleLocalStorage({ setObject: setStacks, data:stackList, storageName: 'stackList', endpoint: '/api/stack/list'});
        }
      }, []);

      useEffect(() => {
        if (stacks){
          setIsLoading(false);
        }
      },[stacks]);

    return (
        <>
        <div className="mb-0">
          <div className="card-header justify-content-start align-items-start">
              <h4 className="mb-0">Stacks</h4>
          </div>
          <div className="card-body">
            {
              ["frontend", "backend", "database", "devops"].map(type => {
              const stacksFiltered = (field || []).filter(stack => stack.type.toLowerCase() === type.toLowerCase());
              return (
                <div key={type}>
                  <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                    <h3>{capitalize(type)}</h3> 
                  </div>
                  <ul className="list-unstyled">
                    {!isLoading && stacksFiltered.map((stack) => (
                      <li key={stack.uid} className='d-flex flex-row justify-content-start align-items-center mb-2'>
                        <RemoveButton onClick={() => handleRemoveStack(stack.uid)} />
                        <strong id={stack.uid}>{capitalize(stack.name)}</strong>
                      </li>
                    ))}
                  </ul>
                  {!isLoading && 
                  <DropDownObjects
                      objList={stacks && stacks.filter((st) => st.type === type).filter((st) => !field?.some(ef => ef?.uid === st.uid))} 
                      handleFieldBlur={handleFieldBlur} 
                      field={field} 
                      type={type}
                      handleAction={handleAddStack} 
                      useAddBtn={true}
                    />
                  }
                </div>
                ) 
              })
            }
          </div>
          </div>

        </>
    );
};

export default StacksCard;