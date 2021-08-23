import React, { useState, useEffect } from 'react';
import './style.css';
import { BsPerson, BsCalendar, BsChatSquareDots, BsBell, BsGear } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { sharedColors } from '../../theme/sharedColor';
import { routers } from '../../config/router';
import { Link, useHistory } from "react-router-dom";

const navIcons = [
    {
        route: routers.HOMEPAGE,
        element: <BsPerson size="33px" color={sharedColors.primaryFontColor} />,
        id: 'home',
        name: 'Patients',
    }, {
        route: routers.CALENDAR_PAGE,
        element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
        id: 'calendar',
        name: 'Schedule',
    }, {
        route: routers.CHATPAGE,
        element: <BsChatSquareDots size="33px" color={sharedColors.primaryFontColor} />,
        id: 'chat',
        name: 'Chat',
    }, /*{
        route: routers.NOTIFICATION,
        element: <BsBell size="33px" color={sharedColors.primaryFontColor} />,
        id: 'notify',
        name: 'Notifications',
    },*/ {
        route: routers.SETTINGS,
        element: <BsGear size="33px" color={sharedColors.primaryFontColor} />,
        id: 'setting',
        name: 'Settings',
    }, {
        route: "/",
        element: <BiLogOut size="33px" color={sharedColors.primaryFontColor} />,
        id: 'logout',
        name: 'Logout',
    }
]
export const SideBar = ({ select }) => {
    const history = useHistory();

    // Style for special text
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }

    const [navMenu, setNavMenu] = useState(navIcons);
    const [selectedTab, setSelectedTab] = useState();

    // Set selected tab icon highlihgt when selectedTab changes
    useEffect(() => {
        setSelectedTab(select);
    }, [select]);

    const logOutHandle = () => {
        localStorage.clear();
        history.push("login");
    }

    return (
        <div className="side-bar">
            <Link className="home-link" to={routers.HOMEPAGE}>
                <h1 className="side-bar-full-title">n<span style={specialColorFont}>.</span></h1>
                <h1 className="side-bar-reduced-title">n<span style={specialColorFont}>.</span></h1>
            </Link>
            <div className="navigation-icons-container">
                {navMenu.map((item, i) => {
                    if (item.id == "logout") {
                        return (
                            <div onClick={logOutHandle} key={i} className="navigation-icons-row">
                                <div id={item.id} className={item.id !== selectedTab ? "navigation-icon-none-selected" : "navigation-icon-selected"}>
                                    {item.element}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <Link key={i} className="navigation-icons-row" to={item.route}>
                                <div id={item.id} className={item.id !== selectedTab ? "navigation-icon-none-selected" : "navigation-icon-selected"}>
                                    {item.element}
                                </div>
                            </Link>
                        );
                    }
                }

                )}
            </div>
        </div >
    )
}
