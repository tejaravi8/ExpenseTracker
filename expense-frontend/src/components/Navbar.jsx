import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.reload();
  };
  return (
    <div className="navbar">
      <div className="logo"> Expense Tracker</div>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/add">Add Transaction</Link>
        <Link to="/split">Split Bills</Link>      </div>
      <div className="user">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        <span>User</span>
        <div className="avatar">U</div>
        

      </div>
      
    </div>
  );
}

export default Navbar;