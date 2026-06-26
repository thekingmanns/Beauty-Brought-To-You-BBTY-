// Safe fallback for localStorage inside sandboxed iframes where sessionStorage/localStorage is blocked
class InMemoryStorage implements Storage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

const checkLocalStorageSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const storage = window.localStorage;
    if (!storage) return false;
    const testKey = '__bbty_storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const safeLocalStorage: Storage = checkLocalStorageSupported()
  ? window.localStorage
  : (new InMemoryStorage() as unknown as Storage);
