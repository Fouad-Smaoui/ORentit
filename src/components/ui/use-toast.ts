interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

let toastTimeout: NodeJS.Timeout;

export function toast(options: ToastOptions) {
  // Clear any existing toast
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-bottom-5';
  
  // Add title
  const titleElement = document.createElement('div');
  titleElement.className = 'font-semibold';
  titleElement.textContent = options.title;
  toastElement.appendChild(titleElement);

  // Add description if provided
  if (options.description) {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'text-sm text-gray-500 mt-1';
    descriptionElement.textContent = options.description;
    toastElement.appendChild(descriptionElement);
  }

  // Add to document
  document.body.appendChild(toastElement);

  // Remove after duration
  toastTimeout = setTimeout(() => {
    toastElement.classList.add('animate-out', 'fade-out', 'slide-out-to-right-5');
    setTimeout(() => {
      document.body.removeChild(toastElement);
    }, 300); // Wait for animation to complete
  }, options.duration || 3000);
} 