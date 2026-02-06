import React, { useEffect, useState } from "react";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import lodash from "lodash";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import jm from "../../../../../jm_navigation";
import ug from "../../../../../ug_navigation";
import { useSelector, useDispatch } from "react-redux";
import { useTranslate, useAuthProvider } from "react-admin";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useMediaQuery } from "@material-ui/core";

const DRAWER_WIDTH_OPEN = 280;
const DRAWER_WIDTH_CLOSED = 80;
const SUBNAV_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: DRAWER_WIDTH_OPEN,
      flexShrink: 0,
    },
    zIndex: 1,
  },
  drawerPaper: {
    background: "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
    width: DRAWER_WIDTH_OPEN,
    flexShrink: 0,
    whiteSpace: "nowrap",
    overflow: "visible",
    border: "none",
  },
  drawerOpen: {
    width: DRAWER_WIDTH_OPEN,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: DRAWER_WIDTH_CLOSED,
    [theme.breakpoints.down("md")]: {
      width: DRAWER_WIDTH_CLOSED,
    },
  },
}));

// Gray theme matching the new design
const theme = {
  bg: "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
  activeBg: "#4b5563",
  hoverBg: "#374151",
  text: "#d1d5db",
  activeText: "#ffffff",
  border: "#4b5563",
  shadow: "0 10px 40px rgba(31, 41, 55, 0.4)",
};

function SidebarPimis(props) {
  const classes = useStyles();
  const muiTheme = useTheme();
  const translate = useTranslate();
  const checkPermission = useCheckPermissions();
  const dispatch = useDispatch();
  const auth = useAuthProvider();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [activeSubmenu, setActiveSubmenu] = useState(null); // { key, label, items }
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;
  const user = useSelector((state) => state.user?.userInfo);

  const link = window && window.location && window.location.hash
    ? window.location.hash.split("/")[1] || ""
    : "";

  const handleDrawerOpen = () => props.onOpenDrawer(true);
  const handleDrawerClose = () => props.onCloseDrawer(false);
  const { className, onSidebarOpen, userLogout, ...rest } = props;

  const handleDrawerToggle = () => props.onMobileOpen(!props.mobileOpened);

  // Collapse button: on mobile close overlay; on desktop toggle narrow/wide
  const handleCollapseClick = () => {
    if (isMobile) {
      props.onMobileOpen(false);
    } else {
      props.opened ? handleDrawerClose() : handleDrawerOpen();
    }
  };

  // Role switcher: close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showRoleSwitch && !e.target.closest("[data-role-switcher]")) {
        setShowRoleSwitch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showRoleSwitch]);

  // Close sub-nav when sidebar is collapsed
  useEffect(() => {
    if (!props.opened) setActiveSubmenu(null);
  }, [props.opened]);

  // Close sub-nav when clicking outside (main content, main nav leaves, etc.); don't close when clicking the trigger or inside the panel
  useEffect(() => {
    if (!activeSubmenu) return;
    const handleClickOutside = (e) => {
      if (e.target.closest("[data-subnav-panel]")) return;
      if (e.target.closest("[data-subnav-trigger]")) return;
      closeSubmenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSubmenu]);

  const handleRoleSelect = (roleId) => {
    if (auth && typeof auth.switchRole === "function") {
      auth.switchRole({ role_id: roleId, success: dispatch });
    }
    setShowRoleSwitch(false);
  };

  const renderTitle = () => {
    switch (appPrefix) {
      case "ug":
        return { full: "IBP", short: "I", subtitle: "Integrated Bank of Projects" };
      case "mzb":
        return { full: "ESNIP", short: "E", subtitle: "" };
      case "jm":
        return { full: "PIMIS", short: "P", subtitle: "Public Investment Management Information System" };
      default:
        return { full: "IBP", short: "I", subtitle: "" };
    }
  };

  const getNavigationMenu = () => {
    switch (appPrefix) {
      case "ug":
        return ug;
      case "mzb":
        return ug;
      case "jm":
        return jm;
      default:
        return ug;
    }
  };

  const isItemActive = (page) => {
    if (page.href && (page.href === "/" + link || page.href.indexOf(link) > -1))
      return true;
    if (page.children && lodash.find(page.children, (c) => c.href && (c.href === "/" + link || c.href.indexOf(link) > -1)))
      return true;
    return false;
  };

  // True if any descendant’s href matches the current route (so only the sub-link is highlighted, not the parent).
  const isDescendantCurrent = (items) =>
    !!(items && items.some((c) =>
      (c.href && (c.href === "/" + link || c.href.indexOf(link) > -1)) || isDescendantCurrent(c.children)
    ));

  const openSubmenu = (key, page) => {
    const label = page.translation ? translate(page.translation) : (page.title || (page.children?.[0]?.title) || "");
    const items = (page.children || [])
      .filter((c) => (c.permission ? checkPermission(c.permission) : true))
      .filter((c) => (c.feature ? checkFeature(c.feature) : true))
      .filter((c) => c.title || (c.children && c.children.length > 0));
    setActiveSubmenu((prev) =>
      prev && prev.key === key ? null : { key, label, items }
    );
  };

  const closeSubmenu = () => setActiveSubmenu(null);

  const getItemKey = (page, idx) => page.href || page.title || `nav-${idx}`;

  // Filter menu tree by search: include item if its label or any descendant's label matches.
  const filterItemForSearch = (item, q, t) => {
    if (!item || !q) return item;
    const raw = (i) => (i.translation ? t(i.translation) : (i.title || (i.children?.[0]?.title) || ""));
    const label = String(raw(item)).toLowerCase();
    const matches = label.indexOf(q) !== -1;

    if (item.children && item.children.length > 0) {
      const filteredCh = item.children
        .map((c) => filterItemForSearch(c, q, t))
        .filter(Boolean);
      if (filteredCh.length > 0) return { ...item, children: filteredCh };
      if (matches) return { ...item };
      return null;
    }
    return matches ? { ...item } : null;
  };

  const renderNavItem = (page, idx, level = 0, parentKey = "") => {
    if (!checkPermission(page.permission)) return null;
    if (page.feature && !checkFeature(page.feature)) return null;

    const hasChildren = page.children && page.children.length > 0;
    const label = page.translation ? translate(page.translation) : (page.title || (page.children?.[0]?.title) || "");
    if (!label && !page.href) return null;

    const key = parentKey ? `${parentKey}-${idx}` : getItemKey(page, idx);
    const isActive = isItemActive(page);
    const canShowChildren = hasChildren &&
      page.children.some((c) =>
        (c.permission ? checkPermission(c.permission) : true) &&
        (c.feature ? checkFeature(c.feature) : true) &&
        (c.title || (c.children && c.children.length > 0))
      );

    if (hasChildren && !canShowChildren && !page.href) return null;
    const paddingLeft = props.opened ? (level > 0 ? 18 + level * 16 : 18) : 16;
    const iconSource = page.icon || (page.children?.[0]?.icon);
    const iconEl = iconSource ? (
      <span style={{ display: "flex", alignItems: "center", minWidth: 20, flexShrink: 0 }}>
        {iconSource}
      </span>
    ) : (
      <span style={{ width: 20, minWidth: 20, flexShrink: 0 }} />
    );

    const isSubmenuOpen = activeSubmenu && activeSubmenu.key === key;
    const isDescendantCurrentRoute = hasChildren && isDescendantCurrent(page.children);
    // Parent is "selected" only when submenu is open AND no child/descendant is the current route
    const parentSelected = isSubmenuOpen && !isDescendantCurrentRoute;

    // Parent with children: opens a separate sub-nav panel (no inline children)
    if (hasChildren && canShowChildren) {
      return (
        <div key={key}>
          <button
            type="button"
            data-subnav-trigger
            onClick={() => openSubmenu(key, page)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: props.opened ? `14px ${paddingLeft}px` : "14px 16px",
              marginBottom: 6,
              background: parentSelected ? theme.activeBg : "transparent",
              color: parentSelected ? theme.activeText : theme.text,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: 13,
              fontWeight: parentSelected ? 600 : 500,
              textAlign: "left",
              justifyContent: props.opened ? "flex-start" : "center",
            }}
            onMouseEnter={(e) => {
              if (!parentSelected) e.currentTarget.style.background = theme.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = parentSelected ? theme.activeBg : "transparent";
            }}
          >
            {iconEl}
            {props.opened && (
              <>
                <span style={{ flex: 1, whiteSpace: "nowrap" }}>{label}</span>
                <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                  <ChevronRight
                    size={18}
                    style={{
                      transform: isSubmenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </span>
              </>
            )}
          </button>
        </div>
      );
    }

    // Leaf with href: RouterLink
    if (page.href) {
      return (
        <div key={key} style={{ marginBottom: 6 }}>
          <RouterLink
            to={page.href}
            target="_self"
            style={{ textDecoration: "none" }}
            onClick={() => {
              if (checkFeature("has_pimis_fields")) {
                dispatch({
                  type: "SET_PROJECT_TITLE_HEADER",
                  payload: { data: "" },
                });
              }
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: props.opened ? `14px ${paddingLeft}px` : "14px 16px",
                background: isActive ? theme.activeBg : "transparent",
                color: isActive ? theme.activeText : theme.text,
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                justifyContent: props.opened ? "flex-start" : "center",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {iconEl}
              {props.opened && <span style={{ flex: 1 }}>{label}</span>}
            </div>
          </RouterLink>
        </div>
      );
    }

    // Group label only (e.g. jm) – no href, no children that passed filters: still show as non-clickable or skip
    if (!hasChildren) return null;

    return null;
  };

  // Build flat list from getNavigationMenu for ug/mzb (ug has mixed; jm has nested groups)
  const renderNavigation = () => {
    const menu = getNavigationMenu();
    const q = (searchValue || "").trim().toLowerCase();
    const menuForRender = q
      ? menu.map((p) => filterItemForSearch(p, q, translate)).filter(Boolean)
      : menu;
    return menuForRender
      .filter((p) => checkPermission(p.permission))
      .filter((p) => (p.feature ? checkFeature(p.feature) : true))
      .map((page, idx) => {
        if (page.children && (checkFeature("has_pimis_fields") || true)) {
          return renderNavItem(page, idx, 0, "");
        }
        // Non-pimis used Collapse with a different structure; we use the same renderNavItem which handles both.
        return renderNavItem(page, idx, 0, "");
      });
  };

  const userRoles = user?.user_roles || [];
  const hasRoleSwitch = userRoles.length > 1;
  const currentRoleName = user?.current_role?.role?.name || "User";
  const displayName = user?.full_name || user?.fullName || user?.name || user?.username || "User";
  const avatarLetter = (displayName || "U").charAt(0).toUpperCase();

  const drawer = (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        boxShadow: theme.shadow,
        position: "relative",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: props.opened ? "20px 24px" : "20px 16px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: props.opened ? "flex-start" : "center",
        }}
      >
        {props.opened ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 50,
                height: 50,
                background: "#ffffff",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <img
                src={`/assets/images/${appPrefix}/${checkFeature("has_pimis_fields") ? "logo" : "coat_of_arms"}.png`}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  color: theme.text,
                  fontWeight: 800,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {renderTitle().full}
              </div>
              {renderTitle().subtitle && (
                <div
                  style={{
                    color: theme.text,
                    fontSize: 11,
                    opacity: 0.85,
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  {renderTitle().subtitle}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              background: "#ffffff",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <img
              src={`/assets/images/${appPrefix}/${checkFeature("has_pimis_fields") ? "logo" : "coat_of_arms"}.png`}
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}
      </div>

      {/* Search */}
      {props.opened && (
        <div style={{ padding: "10px 16px 12px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${theme.border}`,
              minHeight: 36,
            }}
          >
            <Search size={16} color={theme.text} style={{ opacity: 0.6, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 13,
                width: "100%",
                minWidth: 0,
              }}
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                aria-label="Clear search"
                style={{
                  background: "none",
                  border: "none",
                  padding: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.text,
                  opacity: 0.8,
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Role Switcher */}
      {hasRoleSwitch && props.opened && (
        <div style={{ padding: "0 24px 20px 24px", position: "relative" }} data-role-switcher>
          <button
            type="button"
            onClick={() => setShowRoleSwitch(!showRoleSwitch)}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: theme.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <User size={18} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>Current Role</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{currentRoleName}</div>
            </div>
            <ChevronDown
              size={18}
              style={{
                transform: showRoleSwitch ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
          {showRoleSwitch && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 24,
                right: 24,
                background: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                marginTop: 8,
                padding: 8,
                zIndex: 1000,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              {userRoles.map((r) => {
                const isActive = user?.current_role?.role_id === r.role_id;
                return (
                  <button
                    type="button"
                    key={r.role_id}
                    onClick={() => handleRoleSelect(r.role_id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: isActive ? theme.activeBg : "transparent",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      color: isActive ? theme.activeText : theme.text,
                      marginBottom: 4,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = theme.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <User size={18} />
                    <div style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: isActive ? 600 : 500 }}>
                      {r.role && r.role.name}
                    </div>
                    {isActive && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#10b981",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Role indicator when collapsed */}
      {hasRoleSwitch && !props.opened && (
        <div style={{ padding: "0 8px 12px 8px" }} data-role-switcher>
          <button
            type="button"
            onClick={() => setShowRoleSwitch(!showRoleSwitch)}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: theme.text,
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <User size={20} />
            {showRoleSwitch && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "calc(100% + 12px)",
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: 8,
                  minWidth: 220,
                  zIndex: 1000,
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {userRoles.map((r) => {
                  const isActive = (user?.current_role?.role_id) === r.role_id;
                  return (
                    <button
                      type="button"
                      key={r.role_id}
                      onClick={() => handleRoleSelect(r.role_id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        background: isActive ? theme.activeBg : "transparent",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        color: isActive ? theme.activeText : theme.text,
                        marginBottom: 4,
                      }}
                    >
                      <User size={18} />
                      <span style={{ flex: 1, textAlign: "left" }}>{r.role && r.role.name}</span>
                      {isActive && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: props.opened ? "12px 16px" : "12px 8px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {renderNavigation()}
      </nav>

      {/* User profile */}
      {props.opened && (
        <div
          style={{
            padding: "20px 24px",
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 16,
                position: "relative",
              }}
            >
              {avatarLetter}
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#10b981",
                  border: `2px solid #1f2937`,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontWeight: 600, fontSize: 14 }}>
                {displayName}
              </div>
              <div style={{ color: theme.text, fontSize: 12, opacity: 0.7 }}>
                {currentRoleName}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom: Settings, Logout */}
      <div
        style={{
          padding: props.opened ? "12px 16px" : "12px 8px",
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        {(checkPermission("edit_profile") || checkPermission("view_profile")) ? (
          <a
            href={
              checkPermission("edit_profile")
                ? `#/users/${user?.id || ""}`
                : `#/users/${user?.id || ""}/show`
            }
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: props.opened ? "14px 18px" : "14px 16px",
                marginBottom: 6,
                background: "transparent",
                color: theme.text,
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: 13,
                fontWeight: 500,
                justifyContent: props.opened ? "flex-start" : "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Settings size={20} />
              {props.opened && <span>Settings</span>}
            </div>
          </a>
        ) : (
          <RouterLink to="/" target="_self" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: props.opened ? "14px 18px" : "14px 16px",
                marginBottom: 6,
                background: "transparent",
                color: theme.text,
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: 13,
                fontWeight: 500,
                justifyContent: props.opened ? "flex-start" : "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Settings size={20} />
              {props.opened && <span>Settings</span>}
            </div>
          </RouterLink>
        )}
        <button
          type="button"
          onClick={() => userLogout && userLogout()}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: props.opened ? "14px 18px" : "14px 16px",
            marginBottom: 6,
            background: "transparent",
            color: theme.text,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: 13,
            fontWeight: 500,
            justifyContent: props.opened ? "flex-start" : "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.hoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={20} />
          {props.opened && <span>Logout</span>}
        </button>
      </div>

      {/* Sub-nav: separate panel to the right when a parent with children is selected */}
      {activeSubmenu && props.opened && (
        <div
          data-subnav-panel
          style={{
            position: "absolute",
            left: "100%",
            top: 0,
            bottom: 0,
            width: SUBNAV_WIDTH,
            background: "linear-gradient(180deg, #2d3748 0%, #1a202c 100%)",
            borderLeft: `1px solid ${theme.border}`,
            display: "flex",
            flexDirection: "column",
            boxShadow: "4px 0 16px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "16px 16px 12px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span style={{ color: theme.activeText, fontWeight: 600, fontSize: 13 }}>
              {activeSubmenu.label}
            </span>
            <button
              type="button"
              onClick={closeSubmenu}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: theme.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = theme.activeText; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = theme.text; }}
            >
              <X size={18} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 16px" }}>
            {activeSubmenu.items.map((item, i) => {
              const childLabel = item.translation ? translate(item.translation) : (item.title || (item.children?.[0]?.title) || "");
              const childActive = item.href && (item.href === "/" + link || item.href.indexOf(link) > -1);
              const hasGrandChildren = item.children && item.children.length > 0;
              const grandChildren = hasGrandChildren
                ? (item.children || [])
                    .filter((c) => (c.permission ? checkPermission(c.permission) : true))
                    .filter((c) => (c.feature ? checkFeature(c.feature) : true))
                    .filter((c) => c.title && c.href)
                : [];
              const itemKey = (item.title || item.href || "sub") + "-" + i;

              if (hasGrandChildren && grandChildren.length > 0) {
                const itemIcon = item.icon ? (
                  <span style={{ display: "flex", alignItems: "center", minWidth: 18, flexShrink: 0 }}>{item.icon}</span>
                ) : (
                  <span style={{ width: 18, minWidth: 18, flexShrink: 0 }} />
                );
                return (
                  <div key={itemKey} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        color: theme.text,
                        fontSize: 10,
                        fontWeight: 600,
                        opacity: 0.9,
                        marginBottom: 6,
                        paddingLeft: 4,
                        lineHeight: 1.35,
                      }}
                    >
                      {itemIcon}
                      <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word", whiteSpace: "normal" }}>
                        {childLabel}
                      </span>
                    </div>
                    {grandChildren.map((gc, j) => {
                      const gcLabel = gc.translation ? translate(gc.translation) : gc.title;
                      const gcActive = gc.href && (gc.href === "/" + link || gc.href.indexOf(link) > -1);
                      const gcIcon = gc.icon ? (
                        <span style={{ display: "flex", alignItems: "center", minWidth: 18, flexShrink: 0 }}>{gc.icon}</span>
                      ) : (
                        <span style={{ width: 18, minWidth: 18, flexShrink: 0 }} />
                      );
                      return (
                        <RouterLink
                          key={gc.title + j}
                          to={gc.href}
                          target="_self"
                          style={{ textDecoration: "none", display: "block", marginBottom: 4 }}
                          onClick={() => {
                            closeSubmenu();
                            if (checkFeature("has_pimis_fields")) {
                              dispatch({ type: "SET_PROJECT_TITLE_HEADER", payload: { data: "" } });
                            }
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              padding: "8px 10px",
                              borderRadius: 10,
                              background: gcActive ? theme.activeBg : "transparent",
                              color: gcActive ? theme.activeText : theme.text,
                              fontSize: 11,
                              fontWeight: gcActive ? 600 : 500,
                              lineHeight: 1.35,
                            }}
                            onMouseEnter={(e) => {
                              if (!gcActive) e.currentTarget.style.background = theme.hoverBg;
                            }}
                            onMouseLeave={(e) => {
                              if (!gcActive) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {gcIcon}
                            <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word", whiteSpace: "normal" }}>
                              {gcLabel}
                            </span>
                          </div>
                        </RouterLink>
                      );
                    })}
                  </div>
                );
              }

              if (item.href) {
                const itemIcon = item.icon ? (
                  <span style={{ display: "flex", alignItems: "center", minWidth: 20, flexShrink: 0 }}>{item.icon}</span>
                ) : (
                  <span style={{ width: 20, minWidth: 20, flexShrink: 0 }} />
                );
                return (
                  <RouterLink
                    key={itemKey}
                    to={item.href}
                    target="_self"
                    style={{ textDecoration: "none", display: "block", marginBottom: 6 }}
                    onClick={() => {
                      closeSubmenu();
                      if (checkFeature("has_pimis_fields")) {
                        dispatch({ type: "SET_PROJECT_TITLE_HEADER", payload: { data: "" } });
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: childActive ? theme.activeBg : "transparent",
                        color: childActive ? theme.activeText : theme.text,
                        fontSize: 11,
                        fontWeight: childActive ? 600 : 500,
                        lineHeight: 1.35,
                      }}
                      onMouseEnter={(e) => {
                        if (!childActive) e.currentTarget.style.background = theme.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        if (!childActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {itemIcon}
                      <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word", whiteSpace: "normal" }}>
                        {childLabel}
                      </span>
                    </div>
                  </RouterLink>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}

      {/* Collapse / expand button */}
      <button
        type="button"
        onClick={handleCollapseClick}
        style={{
          position: "absolute",
          right: -16,
          top: 90,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: theme.bg,
          border: `2px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {(isMobile && props.mobileOpened) || (!isMobile && props.opened) ? (
          <ChevronLeft size={18} color={theme.text} />
        ) : (
          <ChevronRight size={18} color={theme.text} />
        )}
      </button>
    </div>
  );

  return (
    <div className={classes.root}>
      <nav aria-label="mailbox folders">
        <Hidden mdDown implementation="css">
          <Drawer
            variant="temporary"
            anchor={muiTheme.direction === "rtl" ? "right" : "left"}
            open={props.mobileOpened}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: props.opened,
              [classes.drawerClose]: !props.opened,
            })}
            classes={{
              paper: clsx(classes.drawerPaper, {
                [classes.drawerOpen]: props.opened,
                [classes.drawerClose]: !props.opened,
              }),
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default SidebarPimis;
