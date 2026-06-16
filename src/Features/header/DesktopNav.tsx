import { Link } from "react-router-dom";

export default function DesktopNav() {
  return (
    <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
      <Link to="/products" className="hover:text-gray-500 transition-colors">
        Products
      </Link>
      <Link to="/team" className="hover:text-gray-500 transition-colors">
        Team
      </Link>
      <Link to="/blog" className="hover:text-gray-500 transition-colors">
        Blog
      </Link>
      <Link to="/aboutus" className="hover:text-gray-500 transition-colors">
        About Us
      </Link>
    </nav>
  );
}