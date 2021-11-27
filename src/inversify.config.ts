import Main from '@components/main';
import { Container } from 'inversify';

import { TYPES } from './type';

const myContainer = new Container();

myContainer.bind<any>(TYPES.Main).to(Main);

export { myContainer };
