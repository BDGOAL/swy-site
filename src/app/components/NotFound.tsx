import { useEffect } from "react";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F2F0ED' }}
    >
      <div className="text-center">
        <h1 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          Redirecting...
        </h1>
        <p className="text-sm opacity-60" style={{ fontFamily: 'var(--font-sans)' }}>
          Taking you back to the archive.
        </p>
      </div>
    </div>
  );
}