import { injectable } from 'inversify';

@injectable()
export default class UtilsService {
  public isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}
