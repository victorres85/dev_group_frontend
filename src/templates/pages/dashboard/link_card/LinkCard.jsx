
export default function LinkCard({title, description, image}) {
  return (
    <div className='card d-flex flex-row flex-wrap justify-content-around align-items-center mt-0 mb-3 me-0 w-100 p-2 pb-0'>
    <img src={image} alt={title} 
    className="m-0 mb-3 p-0"
    style={{maxHeight: 180, maxWidth:140}} />
    <div style={{maxWidth:300}} className="m-0 p-0">
        <h6 >{title}</h6>
        <p style={{fontSize:'80%'}}>{description}</p>
    </div>
</div>
  );
}