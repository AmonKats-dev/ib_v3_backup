import React, { useState, useEffect, useRef } from "react";
import { CiLogout } from "react-icons/ci";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { useAuthProvider } from "react-admin";
import { useDispatch } from "react-redux";
import RoleSwitch from "../views/components/RoleSwitch";
import authProvider from "../data/providers/authProvider";

const Header = ({ toggleSidebar, projectData, activeTab, onTabChange, tabCompletionStatus, user }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the project ID from URL params
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown state
  const dropdownRef = useRef(null); // Reference for dropdown
  const auth = useAuthProvider();
  const dispatch = useDispatch();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const handleLogout = () => {
    authProvider.logout();
    navigate("/login");
  };

  const handleRoleSwitch = async (role_id) => {
    console.log("=== Header.handleRoleSwitch called ===");
    console.log("Selected role_id:", role_id);
    console.log("Current user before switch:", user);
    console.log("Current role_id before switch:", user?.current_role?.role_id);
    
    setIsSwitchingRole(true);
    try {
      await auth.switchRole({ role_id, success: dispatch });
      console.log("=== Role switch completed successfully ===");
      // Success - the page will reload after role switch
    } catch (error) {
      console.error("=== Error switching role ===", error);
      setIsSwitchingRole(false);
      // Show error notification
      alert(error.message || "Failed to switch role. Please try again.");
    }
  };

  // Tab completion logic
  const isTabAccessible = (tab) => {
    if (!tabCompletionStatus) return true; // If no completion status provided, allow all tabs
    
    switch (tab) {
      case "contractual":
        return true; // First tab is always accessible
      case "non_contractual":
        return tabCompletionStatus.contractual;
      case "counterpart":
        return tabCompletionStatus.contractual && tabCompletionStatus.nonContractual;
      case "myc_report":
        return tabCompletionStatus.contractual && tabCompletionStatus.nonContractual && tabCompletionStatus.counterpart;
      case "add_myc_info":
        return tabCompletionStatus.contractual && tabCompletionStatus.nonContractual && tabCompletionStatus.counterpart && tabCompletionStatus.mycReport;
      default:
        return true;
    }
  };

  const handleTabClick = (tab) => {
    if (isTabAccessible(tab)) {
      onTabChange(tab);
    }
  };

  const handleBackNavigation = () => {
    // Navigate back to the costed annualized plan page with project data
    if (projectData && projectData.code) {
      navigate(`/implementation-module/${projectData.code}/costed-annualized-plan`, {
        state: {
          projectData: projectData
        }
      });
    } else {
      // Fallback to implementation module if no project data
      navigate("/implementation-module");
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Attach event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="fixed top-0 left-0 right-0 z-1000 bg-white border-b transition-all duration-300 md:left-[250px] md:w-[calc(100%-250px)]">
      {/* Main Header Section */}
      <header className="min-h-[64px] flex items-center justify-between px-5 py-2">
        {/* Hamburger Menu for Small/Medium Devices */}
        <button
          className="text-2xl text-gray-800 md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Header Title */}
        <div className="flex items-center">
          {projectData ? (
            <div className="flex items-center">
              {/* Back Arrow Button */}
              <IconButton
                onClick={handleBackNavigation}
                sx={{ 
                  mr: 2, 
                  backgroundColor: "#f5f5f5",
                  "&:hover": { backgroundColor: "#e0e0e0" }
                }}
                title="Go back to Costed Annualized Plan"
              >
                <ArrowBackIcon />
              </IconButton>
              
              {/* Project Information */}
              <div>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
                  {projectData.title}
                </Typography>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center">
                    <span className="font-medium">Code:</span>
                    <span className="ml-1 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {projectData.code}
                    </span>
                  </span>
                  <span className="flex items-center">
                    <span className="font-medium">Phase:</span>
                    <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Implementation
                    </span>
                  </span>
                  <span className="flex items-center">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      projectData.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {projectData.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">
              Integrated Bank of Projects
            </h3>
          )}
        </div>

        {/* Profile Icon with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <AccountCircleIcon className="text-3xl text-gray-800 cursor-pointer" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-200">
              {/* User Information Section */}
              <div className="px-4 py-3 border-b border-gray-200">
                {user && (user.full_name || user.username) && (
                  <p className="text-sm font-semibold text-gray-900">
                    {user.full_name || user.username}
                  </p>
                )}
                {user && user.email && (
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                )}
              </div>

              {/* Role Section */}
              {user && user.user_roles && user.user_roles.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Role</p>
                  {user.user_roles.length > 1 ? (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{ width: '100%' }}
                    >
                      {(() => {
                        console.log("=== Header: About to render RoleSwitch ===");
                        console.log("user object:", user);
                        console.log("user.current_role:", user.current_role);
                        console.log("user.current_role?.role_id:", user.current_role?.role_id);
                        console.log("user.user_roles:", user.user_roles);
                        return null;
                      })()}
                      <RoleSwitch
                        onSelect={handleRoleSwitch}
                        roles={user.user_roles || []}
                        currentRole={user.current_role?.role_id || null}
                        showLabel={false}
                        key={user.current_role?.role_id || 'no-role'} // Force re-render when role changes
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {user.user_roles[0]?.role?.name || 
                       (user.current_role?.role?.name) || 
                       "N/A"}
                    </p>
                  )}
                </div>
              )}

              {/* Logout Button */}
              <div className="px-2 py-2">
                <button
                  onClick={handleLogout}
                  disabled={isSwitchingRole}
                  className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CiLogout className="mr-2 text-lg" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs Section */}
      {projectData && activeTab && onTabChange && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "contractual"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : isTabAccessible("contractual")
                  ? "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed bg-gray-100"
              }`}
              onClick={() => handleTabClick("contractual")}
              disabled={!isTabAccessible("contractual")}
            >
              Contractual
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "non_contractual"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : isTabAccessible("non_contractual")
                  ? "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed bg-gray-100"
              }`}
              onClick={() => handleTabClick("non_contractual")}
              disabled={!isTabAccessible("non_contractual")}
            >
              Non-Contractual
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "counterpart"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : isTabAccessible("counterpart")
                  ? "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed bg-gray-100"
              }`}
              onClick={() => handleTabClick("counterpart")}
              disabled={!isTabAccessible("counterpart")}
            >
              Counterpart
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "myc_report"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : isTabAccessible("myc_report")
                  ? "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed bg-gray-100"
              }`}
              onClick={() => handleTabClick("myc_report")}
              disabled={!isTabAccessible("myc_report")}
            >
              MYC Report
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "add_myc_info"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : isTabAccessible("add_myc_info")
                  ? "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed bg-gray-100"
              }`}
              onClick={() => handleTabClick("add_myc_info")}
              disabled={!isTabAccessible("add_myc_info")}
            >
              Additional MYC Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const user = state.user?.userInfo || null;
  // Debug: log the current role when user changes
  console.log("=== Header mapStateToProps called ===");
  console.log("Redux state.user:", state.user);
  console.log("Redux state.user.userInfo:", state.user?.userInfo);
  if (user && user.current_role) {
    console.log("Header - Current role ID from Redux:", user.current_role.role_id);
    console.log("Header - Current role object:", user.current_role);
  } else {
    console.log("Header - No user or current_role found");
  }
  return { user };
};

export default connect(mapStateToProps)(Header);
