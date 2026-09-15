type VerifyOpts = {
  token: string;
  secret: string;
  actionExpected?: string;
  minScore?: number;
  timeoutMs?: number;
};

export type RecaptchaCheck = {
  ok: boolean;
  score?: number;
  action?: string;
  reason?: string;
  errorCodes?: string[];
};

export async function verifyRecaptcha({
  token,
  secret,
  actionExpected,
  minScore = 0.5,
  timeoutMs = 5000,
}: VerifyOpts): Promise<RecaptchaCheck> {
  if (!token) return { ok: false, reason: "missing_token" };
  if (!secret) return { ok: false, reason: "missing_secret" };

  // Setup timeout for fetch
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
      signal: controller.signal,
    });

    const data = await res.json();
    clearTimeout(timeout);
    if (!data?.success) {
      return {
        ok: false,
        reason: "not_success",
        errorCodes: Array.isArray(data?.["error-codes"]) ? data["error-codes"] : undefined,
      };
    }
    if (typeof data.score === "number" && data.score < minScore)
      return { ok: false, score: data.score, reason: "low_score" };

    if (actionExpected && data.action && data.action !== actionExpected)
      return { ok: false, action: data.action, reason: "bad_action" };

    return {
      ok: true,
      score: data.score,
      action: data.action,
    };
  } catch {
    clearTimeout(timeout);
    return { ok: false, reason: "network_error" };
  }
}
