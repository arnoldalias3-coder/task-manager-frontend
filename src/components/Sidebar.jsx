import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  const closeSidebar = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar menu"
      >
        ☰
      </button>

      <aside className={`sidebar ${open ? "show-sidebar" : ""}`}>
        <h2>Task Manager</h2>

        <nav>
          <NavLink to="/dashboard" onClick={closeSidebar}>
            Dashboard
          </NavLink>

          <NavLink to="/tasks" onClick={closeSidebar}>
            Tasks
          </NavLink>

          <NavLink to="/add-task" onClick={closeSidebar}>
            Add Task
          </NavLink>

          <NavLink to="/profile" onClick={closeSidebar}>
            Profile
          </NavLink>
        </nav>
      </aside>

      {open && <button className="sidebar-backdrop" onClick={closeSidebar} />}
    </>
  );
}

export default Sidebar;
