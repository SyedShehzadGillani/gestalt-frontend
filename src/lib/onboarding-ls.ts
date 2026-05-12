export const OnboardingLS = {
  get(): any | null {
    try { const raw = localStorage.getItem('onboarding-model'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  set(model: any) {
    try { localStorage.setItem('onboarding-model', JSON.stringify(model)); } catch {}
    window.dispatchEvent(new CustomEvent('onboarding:model-updated'));
  },
  clear() {
    localStorage.removeItem('onboarding-model');
    window.dispatchEvent(new CustomEvent('onboarding:model-updated'));
  }
};
