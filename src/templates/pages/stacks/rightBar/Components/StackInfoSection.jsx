
import capitalize from "../../../../../utils/capitalize";

const StackInfoSection = ({objList, title}) => {
    return (    
        <div >
          <h5 className='mt-2 ms-3 mb-0'>{title}</h5>
            <ul className="list-unstyled">
              <div className="card-body">
                {objList?
                  objList.map((obj, index) => (
                  
                    <li key={index} className='mt-0'>
                      <strong className='ms-3'>{capitalize(title === 'Posts'? '': obj.name)}</strong>
                    </li>
                  ))
                  :
                  ''
                }
              </div>
            </ul>    
        </div>
      );
};
  
export default StackInfoSection;