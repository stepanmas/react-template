import { action, observable } from 'mobx';

class ConfigModel {
  @observable lang: string | null;

  constructor() {
    this.lang = null;
  }

  @action
  setLanguage(lang: string) {
    this.lang = lang;
  }
}

export default new ConfigModel();
export { ConfigModel };
