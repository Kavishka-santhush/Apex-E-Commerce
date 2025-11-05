import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_51QJpRvP3zKCWgLqZLFqQKxYhTnhVBXjmPvBmXxYjmPvBmXxYjmPvBmXxYj');

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Check for success/cancel in URL
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      alert('Payment successful! Your order is being processed.');
    } else if (params.get('canceled')) {
      alert('Payment was canceled. You can try again.');
    }

    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate, location]);

  const handlePayment = async (orderId) => {
    setLoading(true);
    try {
      // Create Stripe checkout session
      const response = await api.post('/payment/create-checkout-session', {
        order_id: orderId
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || 'Payment initialization failed');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
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
      <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div 
            key={order.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-teal-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Order #{order.id}</h3>
                <p className="text-gray-400 text-sm">
                  {new Date(order.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <span className={`px-4 py-2 rounded-lg border font-medium text-sm ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="border-t border-gray-700/50 pt-4 mb-4">
              <h4 className="text-lg font-semibold text-white mb-3">Order Items</h4>
              <div className="space-y-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-700/50 rounded flex items-center justify-center text-xl">
                        📦
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-teal-400 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-teal-400">${order.total_amount}</p>
              </div>
              
              {order.status === 'pending' && (
                <button 
                  onClick={() => handlePayment(order.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/50"
                >
                  {loading ? 'Processing...' : 'Pay with Stripe'}
                </button>
              )}
              
              {order.status === 'completed' && (
                <div className="text-green-400 flex items-center gap-2">
                  <span>✓</span>
                  <span className="font-medium">Delivered</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
