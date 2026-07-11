import { useEffect } from 'react';

type ShortcutMap = Record<string, () => void>;

/**
 * Hook for handling keyboard shortcuts with proper error handling and dependencies
 * Prevents shortcuts when focused on input elements
 */
export const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      try {
        const target = e.target as HTMLElement;
        const tag = target?.tagName?.toLowerCase();

        // Prevent shortcuts when typing in form elements
        if (tag === 'input' || tag === 'textarea' || tag === 'select') {
          return;
        }

        const key = e.key.toLowerCase();
        
        // Check if shortcut exists and execute it safely
        if (key in shortcuts && typeof shortcuts[key] === 'function') {
          e.preventDefault();
          shortcuts[key]?.();
        }
      } catch (error) {
        console.error('Keyboard shortcut error:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    window.addEventListener('keydown', handler);
    
    // Cleanup listener on unmount or when shortcuts change
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
};
