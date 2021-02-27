export default class UtilsService {
  // eslint-disable-next-line class-methods-use-this
  public isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}
