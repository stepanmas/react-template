import { action, makeObservable, observable } from 'mobx';

class ConfigModel {
  @observable lang: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  setLanguage(lang: string) {
    this.lang = lang;
  }
}

export default new ConfigModel();
export { ConfigModel };
