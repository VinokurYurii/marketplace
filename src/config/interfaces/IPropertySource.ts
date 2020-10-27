export interface IPropertySource {
  get<T>(key: string): T;
}
