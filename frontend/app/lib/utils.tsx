import Link from "next/link";
import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { localizedPath, type Locale } from "@/app/lib/i18n/config";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "border-w": [{ border: ["site"] }],
      "border-w-x": [{ "border-x": ["site"] }],
      "border-w-y": [{ "border-y": ["site"] }],
      "border-w-t": [{ "border-t": ["site"] }],
      "border-w-r": [{ "border-r": ["site"] }],
      "border-w-b": [{ "border-b": ["site"] }],
      "border-w-l": [{ "border-l": ["site"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrivacyNote = ({
  privacyNote,
  privacySlug,
  lang,
}: {
  privacyNote: string;
  privacySlug: string;
  lang: Locale;
}) => {
  if (!privacyNote) return null;
  const parts = privacyNote.split(/<|>/g);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <Link
        key={index}
        href={localizedPath(lang, privacySlug)}
        className="font-medium underline hover:no-underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </Link>
    ) : (
      part
    ),
  );
};
