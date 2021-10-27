import axios, { AxiosRequestHeaders } from "axios";

type EventType = "linkIssue" | "getCurrentItem" | "updateCurrentItem" | "getSettings";

class Gtmhub {
  pluginId = "";
  pluginPw = "";

  promiseMap = {};

  constructor({ pluginId, pluginPw }) {
    this.pluginId = pluginId;
    this.pluginPw = pluginPw;

    window.addEventListener("message", (event) => {
      const { type, data } = event.data;
      this.promiseMap[type](data);
    });
  }

  postMessage(type: EventType, data?) {
    window.parent.postMessage(
      {
        type,
        data: {
          ...data,
          pluginSettings: {
            pluginId: this.pluginId,
            pluginPw: this.pluginPw,
          },
        },
      },
      "*"
    );
  }

  /**
   * @param data the updated current item or partial changes object.
   * @returns Updates the current item depending of the 'goal' or 'metric' context.
   */
  updateCurrentItem = (data: unknown): Promise<unknown> => {
    const type = "updateCurrentItem";
    this.postMessage(type, data);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

  /**
   * @returns The current item depending of the 'goal' or 'metric' context.
   */
  getCurrentItem = (): Promise<unknown> => {
    const type = "getCurrentItem";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

  /**
   * @returns The current plugin settings.
   */
  getSettings = (): Promise<unknown> => {
    const type = "getSettings";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

  /**
   * Performs a http request through the plugin-proxy server
   * @returns The response of the plugin-proxy server.
   */
  request = (options: { url: string; method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"; params: Record<string, unknown>; headers: AxiosRequestHeaders }): Promise<unknown> => {
    const urlObject = new URL(options.url);

    // TODO: the url should respect the hosting environment
    const newUrl = "http://localhost:1221/webapp-plugins-proxy" + urlObject.pathname;

    return axios({
      method: options.method,
      url: newUrl,
      headers: options.headers,
      params: {
        host: `${urlObject.host}`,
        ...options.params,
      },
    });
  };

  /**
   * Creates a task in gtmhub and links it with jira-plugin
   */
  linkIssue = (issue): Promise<unknown> => {
    const type = "linkIssue";
    this.postMessage(type, issue);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };
}

window["initializeSdk"] = ({ pluginId, pluginPw }) => {
  /** TODO: add handler which gets the plugin secrets from an api and initialise it with them */
  return new Gtmhub({ pluginId, pluginPw });
};
