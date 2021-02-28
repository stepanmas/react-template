import Main from '@components/main';
import { Container } from 'inversify';

import { TYPES } from './type';
import { IMain } from './type/interfaces';

const myContainer = new Container();

myContainer.bind<IMain>(TYPES.Main).to(Main);

export { myContainer };
