import { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react'; // Add Info import

export default function Toast({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info 
  };

  const styles = {
    success: 'border-green-500/30 bg-green-500/10 text-green-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-300'  // Add info style
  };

  const Icon = icons[type];

  if (!message || !Icon) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
      <div
        className={`flex items-center gap-3 rounded-lg border px-5 py-4 shadow-2xl backdrop-blur-sm ${styles[type] || styles.info}`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}