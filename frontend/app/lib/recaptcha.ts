type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export const loadRecaptcha = (siteKey: string) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window == "undefined") return resolve();
    if (window.grecaptcha) return resolve();

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      reject(new Error("Failed to load reCAPTCHA script"));
    };

    document.head.appendChild(script);
  });
};

export async function getRecaptchaToken(action: string) {
  await loadRecaptcha(SITE_KEY);
  return new Promise<string>((resolve, reject) => {
    if (typeof window == "undefined" || !window.grecaptcha) {
      return reject(new Error("reCAPTCHA not loaded"));
    }

    const grecaptcha = window.grecaptcha;
    grecaptcha.ready(() => {
      grecaptcha
        .execute(SITE_KEY, { action })
        .then((token: string) => {
          resolve(token);
        })
        .catch((err: unknown) => {
          reject(err instanceof Error ? err : new Error(String(err)));
        });
    });
  });
}
