/* eslint-disable react-hooks/exhaustive-deps */
import Logo from '../../../../public/assets/img/company/logo-icon.png';
import { Link } from 'react-router-dom';

function Sidebar() {
  const handleClose = () => {
    document.body.classList.remove('toggled');
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="logo-icon">
          <img src={Logo} className="logo-img" alt="TeamNet" />
        </div>
        <div className="logo-name flex-grow-1">
          <h5 className="mb-0">TeamNet</h5>
        </div>
        <div className="sidebar-close" onClick={handleClose}>
          <span className="material-symbols-outlined">close</span>
        </div>
      </div>
      <div className="sidebar-nav">
        <ul className="metismenu" id="menu">
          <li>
            <Link to="/">
              <div className="parent-icon">
                <span className="material-symbols-outlined">home</span>
              </div>
              <div className="menu-title">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link to="/people">
              <div className="parent-icon">
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <div className="menu-title">People</div>
            </Link>
          </li>
          <li>
            <Link to="/companies">
              <div className="parent-icon">
                <span className="material-symbols-outlined">maps_home_work</span>
              </div>
              <div className="menu-title">Companies</div>
            </Link>
          </li>
          <li>
            <Link to="/softwares">
              <div className="parent-icon">
                <span className="material-symbols-outlined">integration_instructions</span>
              </div>
              <div className="menu-title">Softwares</div>
            </Link>
          </li>
          <li>
            <Link to="/stacks">
              <div className="parent-icon">
                <span className="material-symbols-outlined">home_repair_service</span>
              </div>
              <div className="menu-title">Stacks</div>
            </Link>
          </li>
        </ul>
      </div>
      {/* { name ?
        <div style={{marginTop:-50}} className={`sidebar-bottom d-flex flex-column justify-content-start align-items-start ${dropdownOpen ? 'show' : ''}`}>
          <div className={`dropdown-toggle d-flex align-items-center mb-0 px-3 gap-3 w-100 ${dropdownOpen ? '' : ''}`}  
            onClick={toggleDropdown}>
              <div className="user-img">
                <img src={picture} alt={name ? name : ''} />
              </div>
              <div className="user-info">
                  <h5 className="mb-0 user-name"> { name ? capitalize(name.split(' ')[0]) : ''} </h5>
                  <p className="mb-0 user-designation">{role}</p>
              </div>
          </div>
          <ul className={`${dropdownOpen ? 'moved-up' : 'd-none'}`}>
              <li>
              <Link to="/me" className="dropdown-item">
                  <span className="material-symbols-outlined me-2">account_circle</span>
                  <span>Profile</span>
              </Link>
              </li>
                      <li>
                  <div className="dropdown-divider mb-0"></div>
              </li>
              <li>
                  <a className="dropdown-item" href="/logout/">
                      <span className="material-symbols-outlined me-2">logout</span>
                      <span>Logout</span>
                  </a>
              </li>
          </ul>
        </div>
      : ''} */}
    </>
  );
}

export default Sidebar;