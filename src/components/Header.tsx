
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-photo-primary">
          ФотоОтбор
        </Link>
      </div>
    </header>
  );
};

export default Header;
