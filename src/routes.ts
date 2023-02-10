import { RouteProps } from 'react-router';

export interface IRoute extends RouteProps {
  key: string;
}

const routes: IRoute[] = [
  {
    key: 'systems/main',
    path: '/:lang?',
  },
  {
    key: 'systems/not-found',
    path: '*',
  },
];
export default routes;
