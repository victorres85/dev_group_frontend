import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import './notificationDropDown.css';
import { useState, useRef, useEffect } from "react";
import stringToDate from "../../../../utils/stringToDate";
import capitalize from "../../../../utils/capitalize";


export default function NotificationDropDown({user, setPost}) {
    
    const [openedNotifications, setOpenedNotifications] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [posts, setPosts] = useState();

    useEffect(() => {
        const setPostNotifications = () => {
            setPosts(user.posts);
            setNotificationCount(user.posts.length - openedNotifications);
        }
        if(user){
            setPostNotifications();
        }
    }, [user]);


    const [settingsOpen, setSettingsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setSettingsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const removePostFromNotifications = (uid) => {
        const newPosts = posts.filter((post) => post.uid !== uid);
        user.posts = newPosts;
        localStorage.setItem('user_data', JSON.stringify(user));
        setPosts(newPosts);
        setOpenedNotifications(prev => prev + 1);
        setNotificationCount(prev => prev - 1);
    }
    
    return(
        <div ref={wrapperRef} className="notificationDropDown" onClick={() => setSettingsOpen(!settingsOpen)}>
        {notificationCount >0 && <span className="notificationCount">{notificationCount}</span>}
        <span className="notificationCount"><p>{notificationCount}</p></span>
            <div className="dropdownWrapper" >
                <NotificationsNoneOutlinedIcon  className="dropdownButton"/>
                {settingsOpen && (
            <div>
                <div className='dropdownList card d-flex flex-column justify-content-around align-items-start'>
                    {user.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map((post) =>
                    <div key={post.uid} className="dropdownItem" onClick={()=>{ setPost(post); removePostFromNotifications(post.uid)}}>
                        <div className="dropdownImageWrapper">
                            <img src={post.created_by.picture} alt="" className="dropdownImage" />
                        </div>
                        <div className="dropdownText">
                            <p className="dropdownTextName">{capitalize(post.created_by.name)}</p>
                            <p className="dropdownTextDate">{stringToDate(post.created_at)}</p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
          )} 
            </div>
    </div>
    )
}