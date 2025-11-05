import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    // Get user role
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent hover:from-teal-300 hover:to-cyan-300 transition-all">
              Apex Store
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                Products
              </Link>
              
              {token && userRole === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                  🔧 Admin
                </Link>
              )}
              
              {token && (userRole === 'seller' || userRole === 'admin') && (
                <Link to="/seller/dashboard" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                  🏪 Seller
                </Link>
              )}
              
              {token && (
                <>
                  <Link to="/cart" className="text-gray-300 hover:text-teal-400 transition-colors font-medium relative">
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                    Orders
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {token ? (
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
                >
                  Register
                </Link>
                <Link 
                  to="/seller/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                >
                  Sell on Apex
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
