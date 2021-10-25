import axios, { AxiosRequestHeaders } from "axios";

type EventType = "linkIssue" | "getCurrentGoal" | "getCurrentMetric" | "getCurrentItem" | "updateCurrentItem" | "getSettings";

class Gtmhub {
  pluginId = "";
  pluginPw = "";

  promiseMap = {};

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

  constructor({ pluginId, pluginPw }) {
    this.pluginId = pluginId;
    this.pluginPw = pluginPw;

    window.addEventListener("message", (event) => {
      const { type, data } = event.data;
      this.promiseMap[type](data);
    });
  }

  updateCurrentItem = (data: unknown): Promise<unknown> => {
    const type = "updateCurrentItem";
    this.postMessage(type, data);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

  getCurrentMetric = (): Promise<unknown> => {
    const type = "getCurrentMetric";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

  getCurrentItem = (): Promise<unknown> => {
    const type = "getCurrentItem";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

  getSettings = (): Promise<unknown> => {
    const type = "getSettings";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

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

  getCurrentGoal = (): Promise<unknown> => {
    const type = "getCurrentGoal";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  };

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
