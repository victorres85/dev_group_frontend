
import capitalize from "../../utils/capitalize";

const DefaultInfoSection = ({objList, title }) => {
    return (    
      <div >
          <h5 className='mt-2 ms-3 mb-0'>{title}</h5>
          <ul className=" ms-3 mt-0 pt-0 list-unstyled">
              {objList?
                objList.map((obj, index) => (
                  <li key={index} className='mt-0'>
                    <strong className='ms-3'>{capitalize(title === 'Posts'? obj.created_by.name: obj.name)}</strong>
                  </li>
                ))
                :
                ''
              }
          </ul>    
        </div>
      );
};
  
export default DefaultInfoSection;