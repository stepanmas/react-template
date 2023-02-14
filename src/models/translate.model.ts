import { get } from 'lodash';
import { makeObservable, observable } from 'mobx';
import { from, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import Model from './model';

interface ITranslate {
}

export type TShortTranslateFn = (path: string, variables?: Record<string, any>) => string;

export class TranslateModel extends Model<ITranslate> implements ITranslate {
  @observable currentLanguage: string = 'ru';
  @observable private cache = {};

  public readonly dir = '/lang/';
  public readonly langDefault = 'ru';
  public readonly supportedLanguages: string[] = ['en', 'ru'];
  // public readonly supportedLanguagesLabels: string[] = ['English', 'Русский'];

  constructor() {
    super();
    makeObservable(this);
  }

  public use$(section: string) {
    return this.cache[section]
      ? of(this.cache)
      : from(fetch(`${this.dir + section}/${this.detectLanguageCode()}.json`))
        .pipe(
          switchMap((response: Response) => (
            response.status === 200 ? from(response.json()) : throwError(() => response)
          )),
          tap((data) => {
            this.cache = { ...this.cache, ...data };
          }),
        );
  }

  /* public setLanguage$(lang: string) {
    localStorage.setItem('lang', lang);
    this.currentLanguage = lang;
    moment.locale(lang);
    return of(lang);
  } */

  public detectLanguageCode(detectLocale: boolean = false) {
    const locales = {
      ru: 'ru-RU',
      en: 'en-US',
    };
    let lang = localStorage.getItem('lang');
    lang = lang || window.navigator.language.split('-')[0] || this.langDefault;
    const result = this.supportedLanguages.includes(lang) ? lang : this.langDefault;
    return detectLocale ? locales[lang] : result;
  }

  public get(path: string, variables?: Record<string, any>) {
    return this.replaceIn(get(this.cache, path, path), variables);
  }

  public useShort(): TShortTranslateFn {
    return (path: string, variables?: Record<string, any>) => this.get(path, variables);
  }

  public replaceIn(source: string, variables: Record<string, any> = {}): string {
    return Object
      .keys(variables)
      .reduce(
        (accumulator, current) => accumulator.replace(new RegExp(`\\{${current}\\}`, 'g'), variables[current]),
        source,
      );
  }
}

export default new TranslateModel();
