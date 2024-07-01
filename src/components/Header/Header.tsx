import RestartAltIcon from "@mui/icons-material/RestartAlt";

const Header = ({ onLogout, onReset, children, isAdmin = false }: any) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      {children}
      {isAdmin && (
        <div>
          <span className="text-gray-700 mr-4">Admin</span>
          <button
            onClick={onLogout}
            className="bg-[#ac60ca] hover:bg-[#6C2B85] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      )}
      {onReset && (
        <button
          onClick={onReset}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
        >
          <RestartAltIcon />
        </button>
      )}
    </div>
  );
};

export default Header;
