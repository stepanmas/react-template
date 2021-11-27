import * as React from 'react';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

const langDefault: string = 'en';
const supportedLanguages: string[] = ['en', 'ru'];
// eslint-disable-next-line import/no-mutable-exports
let currentLanguage = langDefault;
// eslint-disable-next-line import/no-mutable-exports
let i18n = {} as any;

declare global {
  interface String {
    replaceOf: (variables: Object) => string;
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.replaceOf = function replaceOf(variables: Object): string {
  return Object
    .keys(variables)
    .reduce(
      (accumulator, current) => accumulator.replace(new RegExp(`\\{${current}\\}`, 'g'), variables[current]),
      this as string,
    );
};

function detectLanguage(): string {
  const langMatch = window.location.pathname.match(/^\/(\w\w)/);
  let lang = langMatch && langMatch.length > 1 ? langMatch[1] : null;
  lang = lang || localStorage.getItem('lang');
  lang = lang || window.navigator.language.split('-')[0] || langDefault;
  return supportedLanguages.includes(lang) ? lang : langDefault;
}

function fetchLanguage(lang: string): Observable<any> {
  return from(fetch(`/lang/${lang}.json`))
    .pipe(
      switchMap((response: Response) => (
        response.status === 200 ? from(response.json()) : throwError(response)
      )),
      tap((result) => {
        i18n = result;
        currentLanguage = lang;
      }),
    );
}

export default i18n;
export {
  detectLanguage,
  fetchLanguage,
  currentLanguage,
};
