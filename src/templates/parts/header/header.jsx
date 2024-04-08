import { useState, useEffect} from 'react';
import Sidebar from '../sidebar/sidebar';
import UserDropDown from './userDropDown/UserDropDown';
import NotificationDropDown from './notificationDropDown/NotificationDropDown';
import './header.css';
import Modal from 'react-modal';
import CommmentsModal from '../../pages/dashboard/comments/CommentsModal';


function Header() {
  const [isToggled, setIsToggled] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [user, setUser] = useState(null); // get the user from the UserContext
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState(null);
  localStorage.setItem('openedNotifications', 0);
  
  useEffect(() => {
    let attempts = 0;
    const intervalId = setInterval(() => {
      attempts++;
      const user_data = localStorage.getItem('user_data');
      if (user_data || attempts >= 5) {
        if (user_data) {
          setUser(JSON.parse(user_data));
          setIsLoading(false);
        }
        clearInterval(intervalId); 
      }
    }, 300);
  }, []);


  const handleMenuClick = () => {
    setIsToggled(!isToggled);
  };

  const handleSidebarHover = () => {
    setIsSidebarHovered(true);
  };

  const handleSidebarHoverEnd = () => {
    setIsSidebarHovered(false);
  };

  
  useEffect(() => {
    if (isToggled) {
      document.body.classList.add('toggled');
      document.getElementsByClassName('sidebar-wrapper')[0].classList.add('nothovered');
    } else {
      document.body.classList.remove('toggled');
      document.getElementsByClassName('sidebar-wrapper')[0].classList.remove('nothovered');
    }
  }, [isToggled]);

  return (
    <>
    <div className="pace-progress" data-progress-text="100%" data-progress="99" style={{transform: 'translate3d(100%, 0px, 0px)'}}>
        <div className="pace-progress-inner"></div>
    </div>
    <header className={`top-header z-3 ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <nav className="navbar navbar-expand justify-content-between">
        <div className="btn-toggle-menu" onClick={handleMenuClick}>
          <span className="material-symbols-outlined">menu</span>
        </div>
        {!isLoading &&
        <div className="navbar-settings">
          <NotificationDropDown user={user} setPost={setPost}/>
          <UserDropDown picture={user.picture}/>
        </div>
      }
      </nav>
      <div className="sidebar-wrapper" onMouseEnter={handleSidebarHover} onMouseLeave={handleSidebarHoverEnd}>
        <Sidebar />
      </div>
          {post && 
          <Modal isOpen={true} onRequestClose={() => setPost(null)}
            className='d-flex flex-column justify-content-center align-items-center z-index-1000 border-0'
            style={{
              zIndex: '10',
              content: {
                width: '50%',
                maxHeight: '95vh',
                height: 'fit-content',
                margin: 'auto',
                marginTop:'10px',
                position:'relative',
              }
            }}>
                <CommmentsModal key={post.uid} post={post} inner={false} innerCount={0} setModal={setPost}/>
          </Modal> 
          }
    </header>
    </>
  );
}

export default Header;






