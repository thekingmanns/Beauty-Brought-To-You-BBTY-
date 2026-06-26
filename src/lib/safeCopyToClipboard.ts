/**
 * A highly robust, iframe sandbox-safe utility for copying text to the clipboard.
 * Gracefully falls back to a temporary textarea element copy action if the modern
 * public navigator.clipboard API is unavailable or throws a SecurityError.
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  // 1. Try modern navigator.clipboard API first
  if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Modern navigator.clipboard.writeText failed in sandbox, trying legacy fallback:", err);
    }
  }

  // 2. Legacy textarea fallback (highly reliable in iframe sandboxes)
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Prevent scrolling and rendering noise
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.warn("All copy to clipboard methods failed in this sandbox environment:", err);
    return false;
  }
}
