import { UPLOAD_URL } from '@app/constants';
import { isEmpty, isPlainObject } from 'lodash';
import queryString, { StringifyOptions } from 'query-string';
import { Observable } from 'rxjs';
import { ajax, AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

export interface IUploadOptions {
  onError?: (response: Response) => void;
  onProgress?: (event: ProgressEvent) => void;
  onStart?: (xhr: XMLHttpRequest, file: File) => void;
  onSuccess?: (data: IUploadedFile) => void;
}

export interface IUploadedFile {
  name?: string;
  url: string;
}

export default class Api {
  private readonly config: AjaxConfig;
  private caseOffKeys: string[] = [];

  constructor(config: AjaxConfig | string) {
    const isStrArg = typeof config === 'string';
    const url = `/api/${isStrArg ? config : config.url}`;
    this.config = {
      method: 'GET',
      headers: Api.getDefaultHeaders(),
      ...(isStrArg ? {} : config),
      url,
    };
  }

  public static getDefaultHeaders() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': '',
    };
  }

  /**
   * Snake case to camel case and vice versa
   * @param source
   * @param toCamelCase
   * @param keysOff - disable transpile for key
   * @param prevKey - support dot notation, only two level
   */
  public static transpileCamelCase(
    source: any,
    toCamelCase = false,
    keysOff: string[] = [],
    prevKey: string = '',
  ): any {
    if (Array.isArray(source)) {
      return source.map((s) => Api.transpileCamelCase(s, toCamelCase, keysOff, prevKey));
    }
    if (!isPlainObject(source) || keysOff[0] === '*') {
      return source;
    }
    return Object.keys(source).reduce(
      (accumulator, current) => {
        const methodDirect = toCamelCase ? 'underscoreToCamelCase' : 'camelCaseToUnderscore';
        return {
          ...accumulator,
          [Api[methodDirect](current)]: keysOff.includes(`${prevKey ? `${prevKey}.` : ''}${current}`)
            ? source[current]
            : Api.transpileCamelCase(source[current], toCamelCase, keysOff, current),
        };
      },
      {},
    );
  }

  public static underscoreToCamelCase = (src: string) => (
    src.replace(/[^_]_([a-z\d])/g, (str, m1) => str.replace(`_${m1}`, m1.toUpperCase()))
  );

  public static camelCaseToUnderscore = (src: string) => (
    src
      .replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`) // |(?<!_|-)(\d+)
      .replace(/^_/, '')
  );

  public static stringify(obj: Object, options: StringifyOptions = {}) {
    return isEmpty(obj)
      ? ''
      : `?${queryString.stringify(Api.transpileCamelCase(obj), options)}`;
  }

  public static parse(getParams: string, options?: any) {
    return Api.transpileCamelCase(queryString.parse(getParams, options), true);
  }

  static async upload(file: File, options: IUploadOptions = {}) {
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('file', file, file.name);
    options.onStart?.(xhr, file);
    xhr.onload = () => options.onSuccess?.(JSON.parse(xhr.response));
    xhr.onerror = () => options.onError?.(xhr.response);
    xhr.onabort = () => options.onError?.(xhr.response);
    xhr.upload.onprogress = (event) => options.onProgress?.(event);

    xhr.open('POST', UPLOAD_URL);
    xhr.send(formData);
    return xhr;
  }

  public get<T = unknown>(): Observable<AjaxResponse<T>> {
    return this.request();
  }

  public post<T = unknown>(): Observable<AjaxResponse<T>> {
    return this.request({ method: 'POST' });
  }

  public put<T = unknown>(): Observable<AjaxResponse<T>> {
    return this.request({ method: 'PUT' });
  }

  public patch<T = unknown>(): Observable<AjaxResponse<T>> {
    return this.request({ method: 'PATCH' });
  }

  public delete<T = unknown>(): Observable<AjaxResponse<T>> {
    return this.request({ method: 'DELETE' });
  }

  /**
   * Поддерживает вложенность, например:
   * results[{ get_params: Object }] = results.get_params
   * или first: { second: Object } = first.second
   * Для Object все ключи и вложенные объекты останутся не тронутые.
   * Причем из first.second, first - это предыдущий ключ.
   * Т.е. first.second.three не сработает, но сработает second.three
   * @param keys
   */
  public caseOff(keys: string[]): this {
    this.caseOffKeys = keys;
    return this;
  }

  protected request<T = unknown>(config?: Partial<AjaxConfig>): Observable<AjaxResponse<T>> {
    const configuration = { ...this.config, ...config };
    if (configuration.body) {
      configuration.body = Api.transpileCamelCase(configuration.body, false, this.caseOffKeys);
    }
    return ajax<T>(configuration).pipe(
      map((res) => ({
        ...res,
        response: Api.transpileCamelCase(res.response, true, this.caseOffKeys),
      })),
    );
  }
}
