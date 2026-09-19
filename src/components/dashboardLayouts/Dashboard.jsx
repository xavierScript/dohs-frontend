import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  BarChart2,
  MapIcon,
  FileText,
  Folder,
  AlertTriangle,
  MapPin,
  Biohazard,
  Lock,
  Dog,
  Leaf,
} from "lucide-react";
import avatarImage from "../../assets/avatar.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Update current path when it changes
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for browser back/forward buttons
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const getUserDisplayName = () => {
    if (!user) return "User";

    // Check if user has first_name and last_name
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    // Fallback to email or just "User"
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const isActivePath = (itemPath) => {
    // Exact match for overview
    if (
      itemPath === "/stakeholder/dashboard" &&
      currentPath === "/stakeholder/dashboard"
    ) {
      return true;
    }
    // For other paths, check if current path starts with the item path
    if (
      itemPath !== "/stakeholder/dashboard" &&
      currentPath.startsWith(itemPath)
    ) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/login";
  };
  const menuItems = [
    { title: "Overview", icon: BarChart2, path: "/stakeholder/dashboard" },
    {
      title: "Interactive Map",
      icon: MapPin,
      path: "/stakeholder/dashboard/map",
    },
    {
      title: "Human Cases",
      icon: Biohazard,
      path: "/stakeholder/dashboard/cases",
    },
    {
      title: "Animal Cases",
      icon: Dog,
      path: "/stakeholder/dashboard/animal-cases",
    },
    {
      title: "Environmental Cases",
      icon: Leaf,
      path: "/stakeholder/dashboard/environmental-cases",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/stakeholder/dashboard/reports",
    },
    // { title: "Projects", icon: Folder, path: "/projects" },
    // {
    //   title: "Epidemic Reports",
    //   icon: AlertTriangle,
    //   path: "/epidemic-reports",
    // },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } h-screen bg-white shadow-lg transition-all duration-300 ease-in-out fixed left-0 top-0`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className={`font-bold ${isOpen ? "block" : "hidden"}`}>
          DOHS Dashboard
        </h1>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img src={avatarImage} alt="Avatar" />
          </div>
          <div className={`ml-3 ${isOpen ? "block" : "hidden"} `}>
            <p className="font-primary font-normal text-xs">
              {getUserDisplayName()}
            </p>
          </div>
        </div>
        <div className="w-48 bg-white p-4">
          {/* <nav className="space-y-4">
        <div className="flex space-x-4 text-sm text-gray-500 mb-4">
          <span className="hover:text-gray-900 cursor-pointer">Favorites</span>
          <span className="hover:text-gray-900 cursor-pointer">Recently</span>
        </div>
        
        <ul className="space-y-3">
          <li className="text-gray-900 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer">
            Overview
          </li>
          <li className="text-gray-900 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer">
            Reports
          </li>

          <li className="text-gray-900 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer">
            Map
          </li>
        </ul>
      </nav> */}
        </div>

        <div className="flex space-x-4 text-sm text-gray-500 mb-4">
          {/* <span className="hover:text-gray-900 cursor-pointer">Favorites</span>
          <span className="hover:text-gray-900 cursor-pointer">Recently</span> */}
        </div>
        {menuItems.map((item, index) => {
          const isActive = isActivePath(item.path);
          return (
            <a
              key={index}
              href={item.path}
              className={`flex items-center p-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-blue-700" : ""}`}
              />
              <span
                className={`ml-3 ${isOpen ? "block" : "hidden"} ${
                  isActive ? "font-medium" : ""
                }`}
              >
                {item.title}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <a
          href="/change-password"
          className={`flex items-center p-3 w-full rounded-lg mb-2 transition-colors ${
            currentPath === "/change-password"
              ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          aria-label="Change Password"
        >
          <Lock
            className={`w-5 h-5 ${
              currentPath === "/change-password" ? "text-blue-700" : ""
            }`}
          />
          <span
            className={`ml-3 ${isOpen ? "block" : "hidden"} ${
              currentPath === "/change-password" ? "font-medium" : ""
            }`}
          >
            Change Password
          </span>
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 w-full rounded-lg hover:bg-gray-100 text-gray-700"
          aria-label="Log Out"
        >
          <LogOut className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? "block" : "hidden"}`}>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

const Header = ({ toggleNotifications }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-64 px-6 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
          aria-label="Search"
        />
      </div>
      <div className="flex items-center gap-4">
        {user.first_name && (
          <div className="flex items-center gap-2">
            <img
              src={avatarImage}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700">
              {user.first_name} {user.last_name}
            </span>
          </div>
        )}
        <button
          onClick={toggleNotifications}
          className="p-2 rounded-lg hover:bg-gray-100 relative"
          aria-label="Toggle Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

const NotificationsPanel = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      title: "Yellow Fever in Kano",
      time: "30 mins ago",
      type: "alert",
    },
    {
      id: 2,
      title: "Report reviewed by Dr. Dale",
      time: "45 minutes ago",
      type: "info",
    },
    {
      id: 3,
      title: "Ebola outbreak in Lagos",
      time: "1 hour ago",
      type: "alert",
    },
  ];

  const activities = [
    {
      id: 1,
      user: "Dr. John",
      action: "uploaded a new report",
      time: "Just now",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      user: "Dr. Sarah",
      action: "analyzed the Ebola out...",
      time: "39 minutes ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 3,
      user: "System update",
      action: "Enhanced real...",
      time: "12 hours ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 4,
      user: "Modified A",
      action: "data in Page X.",
      time: "Today, 11:59 AM",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 5,
      user: "Deleted",
      action: "a page in Project X.",
      time: "Feb 2, 2024",
      avatar: "/api/placeholder/32/32",
    },
  ];

  const contacts = [
    { id: 1, name: "Dr. Dele", avatar: "/api/placeholder/32/32" },
    { id: 2, name: "Dr. Irowa", avatar: "/api/placeholder/32/32" },
    { id: 3, name: "Vet. Dr. Ikpoba", avatar: "/api/placeholder/32/32" },
    { id: 4, name: "Researcher Martins", avatar: "/api/placeholder/32/32" },
    { id: 5, name: "Vet. Dr. Williams", avatar: "/api/placeholder/32/32" },
    { id: 6, name: "Dr. Francis", avatar: "/api/placeholder/32/32" },
  ];

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-80 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <h2 className="font-semibold text-lg text-gray-800">Notifications</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Close Notifications"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications Section */}
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Alerts</h3>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              {notification.type === "alert" && (
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
              )}
              <h4 className="font-medium text-gray-900">
                {notification.title}
              </h4>
            </div>
            <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
          </div>
        ))}
      </div>

      {/* Activities Section */}
      <div className="p-4 space-y-4 border-t">
        <h3 className="text-sm font-semibold text-gray-800">
          Recent Activities
        </h3>
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <img
              src={activity.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contacts Section */}
      <div className="p-4 space-y-4 border-t">
        <h3 className="text-sm font-semibold text-gray-800">Contacts</h3>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-900">{contact.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Header
        toggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
      />
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <main
        className={`pt-16 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
