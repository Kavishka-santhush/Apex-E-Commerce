import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCart(JSON.parse(saved));
    }
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1);
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(0.2);
    } else {
      alert('Invalid promo code');
      setDiscount(0);
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const items = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    try {
      await api.post('/orders', { items });
      localStorage.removeItem('cart');
      setCart([]);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discountAmount + shipping;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products to get started</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div 
              key={item.id} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-teal-500/30 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-700/50 rounded-lg flex items-center justify-center text-3xl">
                  📦
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <p className="text-teal-400 font-bold text-lg">${item.price}</p>
                </div>
                
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            
            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500 transition-all"
                />
                <button
                  onClick={applyPromo}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-green-400 text-sm mt-2">✓ {discount * 100}% discount applied!</p>
              )}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-700/50">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({discount * 100}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              {subtotal < 100 && shipping > 0 && (
                <p className="text-xs text-gray-400">💡 Add ${(100 - subtotal).toFixed(2)} more for free shipping</p>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-teal-400">${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>🔒</span>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
