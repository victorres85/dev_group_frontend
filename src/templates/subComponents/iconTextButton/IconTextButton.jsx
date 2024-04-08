import './iconTextButton.css';

export default function IconTextButton({icon, Txt}){
    var Tag = icon;
    return (
      <div className='userDropDown'>   
        <div className="parent-icon">
          <Tag style={{width:'16px', height:'16px'}}/>
        </div>
        <div className="menu-title">{Txt}</div>
      </div>
  
    );
  }