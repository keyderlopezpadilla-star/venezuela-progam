'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇻🇪' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
] as const;

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: string) => {
    // pathname viene con el locale prefix, lo reemplazamos.
    const segments = pathname.split('/');
    if (segments[1] === currentLocale) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const next = segments.join('/') || '/';
    router.push(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium hover:bg-muted transition-colors">
        <Globe className="h-4 w-4" />
        <span className="uppercase">{currentLocale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-border p-1">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLocale(lang.code)}
            className={`rounded-xl px-3 py-2 cursor-pointer ${
              currentLocale === lang.code ? 'bg-muted' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}