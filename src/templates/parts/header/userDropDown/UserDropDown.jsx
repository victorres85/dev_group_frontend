import { Link } from "react-router-dom"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './userDropDown.css';
import { useState, useRef, useEffect } from "react";
import IconTextButton from "../../../subComponents/iconTextButton/IconTextButton";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


export default function UserDropDown({picture}) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const handleClickOutside = event => {
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


    return(
        <div ref={wrapperRef} className="userDropDown">
        {settingsOpen ? (
            <>
            <div className="dropdownWrapper" onClick={() => setSettingsOpen(false)}>
                <div className="dropdownImageWrapper">
                    <img src={picture} className="dropdownImage" />
                <div>
                <ExpandLessIcon onClick={() => setSettingsOpen(false)} className="dropdownButton"/>
                </div>
                </div>
                    <div className='dropdownList card d-flex flex-column justify-content-around align-items-start'>
                        <div className="dropdownItem">
                            <Link to="/me" onClick={()=>{setSettingsOpen(false)}}>
                                <IconTextButton icon={AccountCircleOutlinedIcon} Txt={'Profile'}/>
                            </Link>
                        </div>
                        <div className="dropdownItem">
                            <a href="/logout/">
                            <IconTextButton icon={LogoutOutlinedIcon} Txt={'Logout'}/>
                            </a>
                        </div>
                    </div>
                </div>
            </>
          ) : (
            <div className="dropdownWrapper" onClick={() => setSettingsOpen(true)}>
                <div className="dropdownImageWrapper">
                    <img src={picture} className="dropdownImage" />
                </div>
                <ExpandMoreIcon  className="dropdownButton dropdownButtonHover"/>
            </div>
          )}
    </div>
    )
}