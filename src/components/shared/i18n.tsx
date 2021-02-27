import * as React from 'react';

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
String.prototype.replaceOf = function (variables: Object): string {
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
  lang = supportedLanguages.includes(lang) ? lang : langDefault;

  return lang;
}

function fetchLanguage(lang: string, callback: Function): void {
  fetch(`/lang/${lang}.json`)
    .then((response: Response) => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response.json());
      }

      return Promise.reject(response.statusText || response.status);
    })
    .then((result) => {
      i18n = result;
      currentLanguage = lang;
      callback(lang);
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export {
  i18n as default,
  detectLanguage,
  fetchLanguage,
  currentLanguage,
};
