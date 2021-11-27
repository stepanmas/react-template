import Main from '@components/main';
import { Container } from 'inversify';

import { TYPES } from './type';
import { IMain } from './type/interface';

const myContainer = new Container();

myContainer.bind<IMain>(TYPES.Main).to(Main);

export { myContainer };
