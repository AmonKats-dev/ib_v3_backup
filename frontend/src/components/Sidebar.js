import React, { useState } from "react";
import {
  FaTachometerAlt,
  // FaUsers,
  // FaCog,
  // FaKey,
  // FaSignOutAlt,
  FaUsersCog,
} from "react-icons/fa";
import { VscProject, VscFileSubmodule } from "react-icons/vsc";
import { AiFillProject } from "react-icons/ai";
import { TbReportSearch, TbBrandMiniprogram } from "react-icons/tb";
import { BiSolidReport } from "react-icons/bi";
import { GoOrganization } from "react-icons/go";
import { LuSquareFunction, LuFileArchive, LuDatabaseZap } from "react-icons/lu";
import { RiFundsLine } from "react-icons/ri";
import { IoPricetagsOutline, IoTrashBinOutline } from "react-icons/io5";
import { GrResources, GrIntegration, GrRevert } from "react-icons/gr";
import { IoIosArrowDown, IoMdLocate } from "react-icons/io"; // Import arrow icon
import { NavLink, useLocation } from "react-router-dom";  //fix side bar 
import Logo from "../assets/coat_of_arms.png";

const Sidebar = ({ isOpen, onSidebarItemClick }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Custom isActive function for Dashboard to handle hash routing
  const isDashboardActive = ({ isActive }) => {
    const pathname = location.pathname;
    const hash = window.location.hash;
    
    // Check if path is /dashboard or hash contains /dashboard
    const isDashboardRoute = pathname === '/dashboard' || 
                             pathname === '/' || 
                             hash === '#/dashboard' || 
                             hash.startsWith('#/dashboard');
    
    return `flex items-center gap-2 px-5 py-3 transition-colors text-sm ${
      isActive || isDashboardRoute
        ? "bg-[#3F51B5] text-white"
        : "hover:bg-[rgb(243_244_246_/100%)] hover:text-black"
    }`;
  };

  // Custom isActive function for Implementation Module to include related form routes
  const isImplementationModuleActive = ({ isActive }) => {
    const pathname = location.pathname;
    
    // Check if path starts with /implementation-module
    if (pathname.startsWith('/implementation-module')) {
      return "flex items-center gap-2 px-5 py-3 transition-colors text-sm bg-[#3F51B5] text-white";
    }
    
    // Check if path matches implementation module form routes
    const implementationModuleRoutes = [
      '/risk-evaluations/',
      '/stakeholder-engagements/',
      '/human-resources/',
    ];
    
    const isActiveRoute = implementationModuleRoutes.some(route => pathname.startsWith(route));
    
    return `flex items-center gap-2 px-5 py-3 transition-colors text-sm ${
      isActive || isActiveRoute
        ? "bg-[#3F51B5] text-white"
        : "hover:bg-[rgb(243_244_246_/100%)] hover:text-black"
    }`;
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      label: "Projects",
      icon: <VscProject />,
      path: "/projects",
    },
    {
      label: "Project Prioritization",
      icon: <AiFillProject />,
      submenu: [
        { label: "Rank Projects", path: "/rank-projects" },
        { label: "Prioritize Projects", path: "/prioritize-projects" },
      ],
    },
    {
      label: "Report Manager",
      icon: <TbReportSearch />,
      submenu: [{ label: "Report Builder", path: "/report-builder" }],
    },
    {
      label: "Implementation Module",
      icon: <FaTachometerAlt />,
      path: "/implementation-module",
    },
    {
      label: "Implementation Report",
      icon: <VscFileSubmodule />,
      submenu: [
        {
          label: "Project Public Investment Plan Report",
          path: "/",
        },
        { label: "Project Completion Report", path: "/" },
        {
          label: "Periodic Project Monitoring Report",
          path: "/",
        },
        {
          label: "Quarterly/Semi-Annual/Annual Project Progress Report",
          path: "/",
        },
        {
          label: "Consolidated Projects Progress Report",
          path: "/",
        },
        {
          label: "MYC Reports",
          path: "/myc-reports",
        },
        {
          label: "Project Prioritization Reports",
          path: "/",
        },
        {
          label: "Appealed Projects",
          path: "/",
        },
      ],
    },
    {
      label: "Report",
      icon: <BiSolidReport />,
      submenu: [
        { label: "Projects in Pipeline", path: "/" },
        { label: "Fiscal Load", path: "/" },
        { label: "Project Cost Evolution", path: "/" },
        {
          label: "Projects at different stages of the project cycle",
          path: "/",
        },
        { label: "Projects Ranking", path: "/" },
        { label: "Projects Locations", path: "/" },
        { label: "IBP User Action Tracking Report", path: "/" },
        { label: "Projects Scheduled for DC", path: "/" },
        { label: "Stagnant Projects", path: "/" },
        { label: "Donor Projects", path: "/" },
        { label: "Submitted Projects", path: "/" },
        { label: "Repeated Projects", path: "/" },
        { label: "Projects by Categories", path: "/" },
        { label: "Projects Costs Chart", path: "/" },
      ],
    },
    {
      label: "User Management",
      icon: <FaUsersCog />,
      submenu: [
        { label: "Users", path: "/" },
        { label: "Roles", path: "/" },
        { label: "User Delegations", path: "/" },
      ],
    },
    {
      label: "Org Structure",
      icon: <GoOrganization />,
      submenu: [
        { label: "Vote", path: "/" },
        { label: "Department", path: "/" },
      ],
    },
    {
      label: "Programs",
      icon: <TbBrandMiniprogram />,
      submenu: [{ label: "Programs", path: "/" }],
    },
    {
      label: "Functions",
      icon: <LuSquareFunction />,
      submenu: [{ label: "Directorate", path: "/" }],
    },
    {
      label: "Funds",
      icon: <RiFundsLine />,
      submenu: [
        { label: "Funds", path: "/" },
        { label: "Fund Source", path: "/" },
      ],
    },
    {
      label: "Costs",
      icon: <IoPricetagsOutline />,
      submenu: [
        { label: "Cost Category", path: "/" },
        { label: "Cost Classification", path: "/" },
      ],
    },
    {
      label: "Locations",
      icon: <IoMdLocate />,
      submenu: [
        { label: "Region", path: "/" },
        { label: "Location", path: "/" },
      ],
    },
    {
      label: "Resources",
      icon: <GrResources />,
      submenu: [
        { label: "Phases", path: "/" },
        { label: "Workflow", path: "/" },
        { label: "M&E Workflow", path: "/" },
        { label: "File Types", path: "/" },
        { label: "Units", path: "/" },
        { label: "Currency", path: "/" },
        { label: "Currency Rates", path: "/" },
        { label: "System Parameters", path: "/" },
        { label: "Sectors", path: "/" },
      ],
    },
    {
      label: "Integration",
      icon: <GrIntegration />,
      submenu: [
        { label: "AMP", path: "/" },
        { label: "PBS", path: "/" },
        { label: "NDP", path: "/" },
      ],
    },
    {
      label: "Recycle Bin",
      icon: <IoTrashBinOutline />,
      path: "/",
    },
    {
      label: "Reverted Projects",
      icon: <GrRevert />,
      path: "/",
    },
    {
      label: "Archive",
      icon: <LuFileArchive />,
      submenu: [
        {
          label: "Upload Files",
          path: "/",
        },
        { label: "Minutes", path: "/" },
        { label: "Decision Matrices", path: "/" },
      ],
    },
    {
      label: "Implementation Data",
      icon: <LuDatabaseZap />,
      submenu: [
        {
          label: "PBS Projects",
          path: "/settings/password-change",
        },
        { label: "Budget Allocations", path: "/" },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 w-[250px] h-full bg-white text-black z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 overflow-y-auto`}
    >
      {/* Sidebar Header */}
      <div className="flex sticky top-0 items-center gap-3 px-4 min-h-[64px] border-b bg-white z-10">
        <div className="w-10 h-10">
          <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h3 className="text-[#263238] text-2xl font-medium leading-[28px] tracking-[-0.06px]">
          IBP
        </h3>
      </div>

      {/* Navigation Links */}
      <ul className="pt-4 pb-6 border-r">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.submenu ? (
              <>
                <div
                  className="flex items-center justify-between gap-2 px-5 py-3 cursor-pointer transition-colors text-sm hover:bg-[rgb(243_244_246_/100%)] hover:text-black"
                  onClick={() => toggleMenu(item.label)}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                  {/* Arrow Icon */}
                  <IoIosArrowDown
                    className={`transition-transform duration-300 ${
                      openMenu === item.label ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                {openMenu === item.label && (
                  <ul className="pl-10">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={subItem.path}
                          onClick={() => onSidebarItemClick && onSidebarItemClick()}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-2 transition-colors text-sm ${
                              isActive
                                ? "bg-[#3F51B5] text-white"
                                : "hover:bg-[rgb(243_244_246_/100%)] hover:text-black"
                            }`
                          }
                        >
                          {/* <span className="w-5">{subItem.icon}</span> */}
                          {subItem.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                onClick={() => onSidebarItemClick && onSidebarItemClick()}
                className={item.label === "Dashboard"
                  ? isDashboardActive
                  : item.label === "Implementation Module" 
                  ? isImplementationModuleActive
                  : ({ isActive }) =>
                    `flex items-center gap-2 px-5 py-3 transition-colors text-sm ${
                      isActive
                        ? "bg-[#3F51B5] text-white"
                        : "hover:bg-[rgb(243_244_246_/100%)] hover:text-black"
                    }`
                }
                end={item.label !== "Implementation Module" && item.label !== "Dashboard"}
              >
                {item.icon}
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
