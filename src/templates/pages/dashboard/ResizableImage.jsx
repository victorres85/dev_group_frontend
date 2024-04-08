import { Resizable } from 'react-resizable';

const ResizableImage = ({ src, alt }) => {
  return (
    <Resizable width={200} height={200}>
      <img src={src} alt={alt} style={{ maxWidth: '500px', maxHeight: '500px' }} />
    </Resizable>
  );
};

export default ResizableImage;