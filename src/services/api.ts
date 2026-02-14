
import type { Product, Order, User, DashboardStats, OrderStatus, SupportTicket, Review, TicketReply, TicketStatus } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

// Local Storage Keys
const KEYS = {
  FAVORITES: 'qs_favorites',
  CART: 'qs_cart',
  USER: 'qs_current_user',
  ORDERS: 'qs_local_orders',
  REVIEWS: 'qs_local_reviews',
  PRODUCTS: 'qs_local_products',
  TICKETS: 'qs_local_tickets'
};

class LocalApiService {
  public isReady = true;
  public needsSetup = false;

  constructor() {
    // Initialize empty arrays in storage if not exists
    if (!localStorage.getItem(KEYS.FAVORITES)) localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.ORDERS)) localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.REVIEWS)) localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
    
    // Seed initial products if storage is empty
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    
    // Initialize tickets if empty
    if (!localStorage.getItem(KEYS.TICKETS)) {
      localStorage.setItem(KEYS.TICKETS, JSON.stringify([]));
    }
  }

  // Helper for config status (always valid now as it's static)
  getConfigStatus() {
    return {
      api_key: { present: true, valid: true },
      supabase_url: { present: true, valid: true },
      supabase_anon_key: { present: true, valid: true }
    };
  }

  async initializeDatabase(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  // --- LOCAL DATA PERSISTENCE ---

  // Fix: Read products from local storage instead of constant to allow CRUD
  async getProducts(): Promise<Product[]> {
    const products = localStorage.getItem(KEYS.PRODUCTS);
    return products ? JSON.parse(products) : INITIAL_PRODUCTS;
  }

  // Fix: Implemented addProduct for AdminDashboard
  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `P-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...products, newProduct];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    return newProduct;
  }

  // Fix: Implemented updateProduct for AdminDashboard
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return updated;
  }

  // Fix: Implemented deleteProduct for AdminDashboard
  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
  }

  async getFavorites(): Promise<string[]> {
    const favs = localStorage.getItem(KEYS.FAVORITES);
    return favs ? JSON.parse(favs) : [];
  }

  async toggleFavorite(productId: string): Promise<string[]> {
    const favs = await this.getFavorites();
    const index = favs.indexOf(productId);
    let updatedFavs: string[];
    
    if (index === -1) {
      updatedFavs = [...favs, productId];
    } else {
      updatedFavs = favs.filter(id => id !== productId);
    }
    
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updatedFavs));
    return updatedFavs;
  }

  async getReviews(productId?: string): Promise<Review[]> {
    const revsStr = localStorage.getItem(KEYS.REVIEWS);
    const revs: Review[] = revsStr ? JSON.parse(revsStr) : [];
    if (productId) {
      return revs.filter(r => r.productId === productId);
    }
    return revs;
  }

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const revs = await this.getReviews();
    const newReview: Review = {
      ...review,
      id: `REV-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newReview, ...revs];
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(updated));
    return newReview;
  }

  // Fix: Implemented deleteReview for AdminDashboard
  async deleteReview(id: string): Promise<void> {
    const reviews = await this.getReviews();
    const updated = reviews.filter(r => r.id !== id);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(updated));
  }

  // Mock User profile
  getCurrentUser(): User | null {
    const user = localStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  async login(mobile: string, password?: string, email?: string): Promise<User> {
    const newUser: User = { 
      id: `U-${Math.random().toString(36).substr(2, 6)}`, 
      mobile, 
      email: email || '', 
      name: `User ${mobile.slice(-4)}`, 
      role: 'customer' 
    };
    localStorage.setItem(KEYS.USER, JSON.stringify(newUser));
    return newUser;
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentUser();
    if (!current) throw new Error("Not logged in");
    const updated = { ...current, ...updates };
    localStorage.setItem(KEYS.USER, JSON.stringify(updated));
    return updated;
  }

  logout() {
    localStorage.removeItem(KEYS.USER);
  }

  // Orders (Stored locally for history)
  async getOrders(): Promise<Order[]> {
    const orders = localStorage.getItem(KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const orders = await this.getOrders();
    const newOrder: Order = { 
      ...orderData, 
      id: `ORD-${Math.random().toString(36).toUpperCase().substr(2, 6)}`, 
      status: 'Processing', 
      createdAt: new Date().toISOString() 
    };
    const updated = [newOrder, ...orders];
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
    return newOrder;
  }

  // Fix: Implemented updateOrderStatus for AdminDashboard
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = await this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
  }

  // Fix: Implemented support ticket methods
  async getTickets(): Promise<SupportTicket[]> {
    const tickets = localStorage.getItem(KEYS.TICKETS);
    return tickets ? JSON.parse(tickets) : [];
  }

  async addTicketReply(ticketId: string, sender: 'User' | 'Admin', message: string): Promise<SupportTicket> {
    const tickets = await this.getTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error("Ticket not found");
    
    const newReply: TicketReply = {
      id: `REP-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      sender,
      message,
      createdAt: new Date().toISOString()
    };
    
    tickets[index].replies.push(newReply);
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
    return tickets[index];
  }

  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket> {
    const tickets = await this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");
    ticket.status = status;
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
    return ticket;
  }

  // Fix: Updated stats calculation for Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const products = await this.getProducts();
    const orders = await this.getOrders();
    const reviews = await this.getReviews();
    const tickets = await this.getTickets();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      activeProducts: products.length,
      lowStockCount: products.filter(p => p.stock < 10).length,
      openTicketsCount: tickets.filter(t => t.status !== 'Closed').length,
      totalReviews: reviews.length
    };
  }

  // Fix: Updated signature to accept args from ProductDetails
  async canUserReviewProduct(userId: string, productId: string): Promise<boolean> {
    const orders = await this.getOrders();
    return orders.some(o => o.userId === userId && o.items.some(i => i.id === productId));
  }

  async runAutoSetup(): Promise<boolean> { return true; }
  getSchemaSQL() { return ""; }
  getRPCSetupSQL() { return ""; }
}

export const api = new LocalApiService();
