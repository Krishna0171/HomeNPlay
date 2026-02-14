
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { ProductDetails } from './pages/ProductDetails';
import { Profile } from './pages/Profile';
import { MyOrders } from './pages/MyOrders';
import { OrderDetails } from './pages/OrderDetails';
import { FAQ } from './pages/FAQ';
import { ContactSupport } from './pages/ContactSupport';
import { Favorites } from './pages/Favorites';
import { Loader } from './components/Loader';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ChatBot } from './components/ChatBot';
import type { Product, CartItem, User, Address, PaymentMethod } from './types';
import { api } from './services/api';
import { BUSINESS_PHONE } from './constants';
import { CheckCircle, X, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Welcome to QuickStore...');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [checkoutAddress, setCheckoutAddress] = useState<Address>({ street: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    const init = async () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      if (currentUser?.address) setCheckoutAddress(currentUser.address);
      
      const savedCart = localStorage.getItem('qs_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const favs = await api.getFavorites();
      setFavorites(favs);
      
      setIsGlobalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('qs_cart', JSON.stringify(cart));
  }, [cart]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedProductId(null);
    setSelectedOrderId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDetails = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrderDetails = (id: string) => {
    setSelectedOrderId(id);
    setCurrentPage('order-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        showNotification(`Updated quantity in cart!`);
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      showNotification('Added to cart!');
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleFavorite = async (productId: string) => {
    const updated = await api.toggleFavorite(productId);
    setFavorites([...updated]);
    showNotification(updated.includes(productId) ? 'Added to Wishlist' : 'Removed from Wishlist');
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showNotification('Removed from cart');
  };

  const handleCheckout = (shippingAddress: Address, paymentMethod: PaymentMethod) => {
    setCheckoutAddress(shippingAddress);
    
    setConfirmModal({
      isOpen: true,
      title: 'Redirect to WhatsApp',
      message: `We will open WhatsApp to confirm your order details with our support team.`,
      confirmText: 'Send via WhatsApp',
      type: 'info',
      onConfirm: () => executeOrder(shippingAddress, paymentMethod),
    });
  };

  const executeOrder = async (shippingAddress: Address, paymentMethod: PaymentMethod) => {
    setIsGlobalLoading(true);
    setLoadingMessage('Preparing your order message...');
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    const orderData = {
      userId: user?.id || 'GUEST',
      customerName: user?.name || 'Customer',
      customerMobile: user?.mobile || '',
      items: cart,
      total,
      paymentMethod,
      shippingAddress
    };

    try {
      // 1. Save locally for history
      const order = await api.createOrder(orderData);
      
      // 2. Format WhatsApp Message
      const message = `*NEW ORDER - QuickStore*\n\n` +
        `*Customer:* ${orderData.customerName}\n` +
        `*Address:* ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\n` +
        `*Payment:* ${paymentMethod}\n\n` +
        `*Items:*\n` + 
        cart.map(i => `• ${i.name} (x${i.quantity}) - Rs. ${(i.price * i.quantity).toFixed(2)}`).join('\n') +
        `\n\n*Total Amount:* Rs.${total.toFixed(2)}`;

      const waUrl = `https://wa.me/91${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
      
      // 3. Clear Cart and Redirect
      setCart([]);
      setIsGlobalLoading(false);
      window.open(waUrl, '_blank');
      showNotification('Opening WhatsApp...');
      navigateToOrderDetails(order.id);
    } catch (err) {
      setIsGlobalLoading(false);
      showNotification('Redirect failed.', 'error');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mobile = formData.get('mobile') as string;
    const name = formData.get('name') as string;
    
    setIsGlobalLoading(true);
    try {
      const loggedInUser = await api.login(mobile, '123456', '');
      if (name) await api.updateUserProfile({ name });
      setUser(api.getCurrentUser());
      setIsGlobalLoading(false);
      navigateToHome();
    } catch (error) {
      setIsGlobalLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigateToHome();
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isGlobalLoading && <Loader fullPage message={loadingMessage} />}
      
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
      />
      
      <Navbar 
        currentPage={currentPage}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        user={user} 
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onShopClick={() => {
          if (currentPage !== 'home') handleNavigate('home');
          setTimeout(() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
      />

      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-10">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'
          }`}>
            <CheckCircle className="h-5 w-5" />
            <p className="font-bold text-sm">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded transition-colors"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && <Home onAddToCart={addToCart} onViewProduct={navigateToDetails} onNavigate={handleNavigate} favorites={favorites} onToggleFavorite={toggleFavorite} onOpenChat={() => setIsChatOpen(true)} />}
        {currentPage === 'details' && selectedProductId && <ProductDetails productId={selectedProductId} onBack={navigateToHome} onAddToCart={addToCart} onViewProduct={navigateToDetails} favorites={favorites} onToggleFavorite={toggleFavorite} />}
        {currentPage === 'cart' && <Cart items={cart} user={user} initialAddress={checkoutAddress} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onCheckout={handleCheckout} onBackToShop={navigateToHome} />}
        {currentPage === 'favorites' && <Favorites onAddToCart={addToCart} onViewProduct={navigateToDetails} favorites={favorites} onToggleFavorite={toggleFavorite} />}
        {currentPage === 'profile' && user && <Profile user={user} onUpdate={setUser} showNotification={showNotification} />}
        {currentPage === 'my-orders' && user && <MyOrders userId={user.id} onNavigateToHome={navigateToHome} onSelectOrder={navigateToOrderDetails} />}
        {currentPage === 'order-details' && selectedOrderId && <OrderDetails orderId={selectedOrderId} onBack={() => setCurrentPage('my-orders')} />}
        {currentPage === 'faq' && <FAQ />}
        {currentPage === 'contact' && <ContactSupport onNavigate={handleNavigate} onOpenChat={() => setIsChatOpen(true)} />}
        {currentPage === 'login' && (
          <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">Get Started</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input name="mobile" type="tel" required maxLength={10} className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="9999999999" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700">Full Name</label>
                <input name="name" type="text" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">Sign In</button>
            </form>
          </div>
        )}
      </main>

      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} onNavigate={handleNavigate} />

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-xs">
          &copy; {new Date().getFullYear()} QuickStore. Ready for market validation.
        </div>
      </footer>
    </div>
  );
};

export default App;
