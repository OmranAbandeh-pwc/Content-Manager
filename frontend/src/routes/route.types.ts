export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  children?: RouteConfig[];
  protected?: boolean;
  roles?: string[];
}
