import SearchIcon from '@mui/icons-material/Search';

export function AddButton({ onClick }) {
    return (
      <div className="d-flex justify-content-end">
        <span className='material-symbols-outlined me-2 d-flex justify-content-center align-items-center rounded-5 roundButton' style={{width:19, height:19}} onClick={onClick}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path fill="white" d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </span>
      </div>
    );
  }
  

  export function RemoveButton({ onClick }) {
    return (
    <div className="material-symbols-outlined me-2 d-flex justify-content-center align-items-center rounded-5 roundButton" style={{width:19, height:19}} onClick={onClick}>
        <svg height="17" viewBox="0 0 24 24" width="17"><path d="M0 0h24v24H0z" fill="none"/><path fill="white" d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
      </div>
    );
  }


  export function SearchButton({ onClick }) {
    return (
      <div className="d-flex justify-content-end">
        <span className='material-symbols-outlined me-2 d-flex justify-content-center align-items-center rounded-5 roundButton' style={{width:19, height:19}} onClick={onClick}>
          <SearchIcon style={{height:19}}/>
        </span>
      </div>
    );
  }

  


