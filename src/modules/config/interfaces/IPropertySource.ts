export interface IPropertySource {
  get<T>(key: string, defaultValue?: any): T;
}
