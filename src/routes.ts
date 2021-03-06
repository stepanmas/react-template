import { RouteProps } from 'react-router';

export interface IRoute extends RouteProps {
  key: string;
}

const routes: IRoute[] = [
  {
    exact: true,
    key: 'main',
    path: '/:lang?',
  },
  {
    key: 'not-found',
    path: '*',
  },
];
export default routes;
