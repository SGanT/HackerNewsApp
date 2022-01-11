import { environment } from "src/environments/environment";

export abstract class BaseHttpServiceService {

  constructor() { }

  protected get baseUrl(): string {
    return environment.apiURL;
  }

  protected abstract get servicePathName(): string;

  /**
   * Returns service endpoint URL
   * 
   * @param action
   * @param servicePath The path to action
   */
  protected endpoint(action: string, servicePath?: string) {
    return [this.baseUrl, (servicePath || this.servicePathName), action].join('/');
  }

  /**
   * Constructs any URL from API URL and URI provided
   * 
   * @param uri 
   */
  protected url(uri: string) {
    return [this.baseUrl, uri].join('/');
  }
}
