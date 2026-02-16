import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle
  };

  const styles = {
    success: 'border-green-500/30 bg-green-500/10 text-green-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300'
  };

  const Icon = icons[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
      <div
        className={`flex items-center gap-3 rounded-lg border px-5 py-4 shadow-2xl backdrop-blur-sm ${styles[type]}`}
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
