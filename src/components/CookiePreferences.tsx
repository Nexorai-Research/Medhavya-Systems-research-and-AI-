"use client";

import { useEffect, useRef, useState } from "react";
import { configureAnalytics } from "@/lib/analytics";

const KEY = "ms-analytics-consent";

function readConsent(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "granted";
  } catch {
    return false;
  }
}

/**
 * Footer control that opens a native <dialog> (focus trap, Escape and inert background come
 * from the browser). The choice only records consent; no analytics provider is configured yet,
 * so nothing is collected either way. Storage failures fall back to "not consented".
 */
export function CookiePreferences() {
  const ref = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const granted = readConsent();
    configureAnalytics(null, granted);
  }, []);

  const open = () => {
    setAnalytics(readConsent());
    ref.current?.showModal();
  };

  const save = () => {
    try {
      window.localStorage.setItem(KEY, analytics ? "granted" : "denied");
    } catch {
      // Private mode or blocked storage: the choice simply does not persist.
    }
    configureAnalytics(null, analytics);
    ref.current?.close();
  };

  return (
    <>
      <button type="button" onClick={open} className="hover:text-white">
        Cookie preferences
      </button>
      <dialog ref={ref} aria-labelledby="cookie-prefs-title" className="m-auto w-[min(92vw,30rem)] rounded-[var(--radius-lg)] border border-line bg-white p-6 text-ink backdrop:bg-midnight/60">
        <h2 id="cookie-prefs-title" className="text-lg font-semibold text-midnight">
          Cookie preferences
        </h2>
        <p className="mt-2 text-sm text-muted">This website currently uses only storage that is strictly necessary. No analytics provider is configured, so nothing is being collected today.</p>
        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked disabled className="mt-1 size-4" />
            <span>
              <span className="font-medium text-midnight">Strictly necessary</span>
              <span className="block text-muted">Always on. Needed for the site to work.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 size-4 accent-[var(--color-primary)]" />
            <span>
              <span className="font-medium text-midnight">Anonymous usage analytics</span>
              <span className="block text-muted">Off by default. Applies only if analytics is introduced later; personal fields are always stripped.</span>
            </span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} className="min-h-11 px-4 text-sm font-medium text-ink">
            Cancel
          </button>
          <button type="button" onClick={save} className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white">
            Save choice
          </button>
        </div>
      </dialog>
    </>
  );
}
