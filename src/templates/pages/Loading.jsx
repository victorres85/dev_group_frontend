import { useEffect, useState } from 'react';

const Loading = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(dots => dots.length < 3 ? dots + '.' : '');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{height:'100%', maxHeight:400, width:'100%'}} className="d-flex flex-column align-items-center justify-content-center">
      <p style={{fontSize:'32px'}} className='text-primary'>Loading{dots}</p>
    </div>
  );
};

export default Loading;