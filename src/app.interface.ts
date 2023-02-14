export interface IListResponse<T = any> {
  count: number;
  results: T[];
}
