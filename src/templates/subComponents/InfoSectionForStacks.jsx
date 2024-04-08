
import capitalize from "../../utils/capitalize";
import { getIconClass } from "../../utils/getIconClass";

const InfoSectionForStacks = ({objList, title}) => {
    return (    
        <div >
          <h5 className='mt-2 ms-3 mb-0'>{title}</h5>
             {
               Object.entries(objList.reduce((grouped, stack) => {
                 (grouped[stack.type] = grouped[stack.type] || []).push(stack);
                 return grouped;
               }, {})).map(([type, stacks]) => (
                 <div key={type} className="card-body p-0 ps-3 pt-2 mb-0 ms-3 mt-0">
                   <h6 className='pt-2'>{capitalize(type)}</h6>
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
             }  
        </div>
      );
};
  
export default InfoSectionForStacks;