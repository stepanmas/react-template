import { makeObservable } from 'mobx';

import Model from './model';

export interface IConfigModel {
}

class ConfigModel extends Model<IConfigModel> implements IConfigModel {
  constructor() {
    super();
    makeObservable(this);
  }
}

export default new ConfigModel();
export { ConfigModel };
