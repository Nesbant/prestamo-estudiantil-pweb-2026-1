const NavButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`transition-colors cursor-pointer underline-offset-8 decoration-2 ${isActive ? 'text-[#00543D] underline' : 'hover:text-gray-900'}`}
    >
      {children}
    </button>
  );
};

export default NavButton;
