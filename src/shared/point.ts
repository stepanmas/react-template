import Api from '@app/shared/api';
import { RouteProps } from 'react-router';

export type IRouteProps<T = any> = RouteProps & {
  path: string;
  // permissions?: T[] | (() => boolean);
};

export default abstract class Point {
  protected path: string[] = [];

  protected abstract readonly base: string;

  public getRoute(): IRouteProps {
    return {} as IRouteProps;
  }

  public root(base?: string): this {
    this.path = [];
    this.path.push(base || this.base);
    return this;
  }

  public params(obj: Record<string, any>) {
    this.path.push(Api.stringify(obj));
    return this.build(false);
  }

  public build(endSlash: boolean = true) {
    return `${this.path.join('/')}${endSlash ? '/' : ''}`;
  }

  public uuid(uuid: string | number) {
    if (uuid !== 0) {
      this.path.push(uuid.toString());
    }
    return this;
  }

  public view(mode: 'edit' | 'view') {
    this.path.push(mode);
    return this;
  }
}
