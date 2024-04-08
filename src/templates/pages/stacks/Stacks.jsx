import { useState} from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StacksTable from './stacksTable/stacksTable';
import StacksRightBar from './rightBar/StacksRightBar';

const StacksPage = () => {
  const [selectedStack, setSelectedStack] = useState([]);
  const fullScreen = window.innerWidth > 992;

  const displayStack = ((stack)=>{
    setSelectedStack(stack);
});

  return (
    <div className="d-flex w-100 gap-5 mt-4">
      <div className="feed">
          <StacksTable 
            displayStack={displayStack} 
            fullScreen={fullScreen} 
            />
      </div>
      <StacksRightBar 
        selectedStack={selectedStack}
        fullScreen={fullScreen}
      />
    </div>
  );
}

export default StacksPage;
