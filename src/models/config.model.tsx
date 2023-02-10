import { action, makeObservable, observable } from 'mobx';

import Model from './model';

export interface IConfigModel {
  lang: string;
}

class ConfigModel extends Model<IConfigModel> implements IConfigModel {
  @observable lang: string = 'ru';

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setLanguage(lang: string) {
    this.lang = lang;
  }
}

export default new ConfigModel();
export { ConfigModel };
