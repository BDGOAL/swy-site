import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ShopifyProvider, useShopify } from './context/ShopifyContext';
import { ShoppingCart } from './components/ShoppingCart';
import { ShopifyConnectionTest } from './components/ShopifyConnectionTest';
import { Component, ErrorInfo, ReactNode } from 'react';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          fontFamily: 'monospace',
          backgroundColor: '#0A0E14',
          color: '#F2F0ED',
          minHeight: '100vh',
        }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              border: '1px solid #F2F0ED',
              backgroundColor: 'transparent',
              color: '#F2F0ED',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App with ShopifyProvider wrapper
export default function App() {
  return (
    <ErrorBoundary>
      <ShopifyProvider>
        <AppContent />
      </ShopifyProvider>
    </ErrorBoundary>
  );
}

// App content that uses Shopify context
function AppContent() {
  const { isCartOpen, closeCart } = useShopify();
  
  return (
    <>
      {/* Shopping Cart Sidebar */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={closeCart} 
      />

      {/* Shopify Connection Test (开发环境) */}
      {import.meta.env.DEV && (
        <div id="shopify-test">
          <ShopifyConnectionTest />
        </div>
      )}

      {/* Main Router */}
      <RouterProvider router={router} />
    </>
  );
}