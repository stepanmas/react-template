import { action, makeObservable, observable } from 'mobx';

import Model from './Model';

class ConfigModel extends Model {
  @observable lang: string | null = null;

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
