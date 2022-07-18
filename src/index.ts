import axios, { AxiosRequestHeaders } from "axios";
import {
  SdkEventType,
  GtmhubSdkDc,
  Setting,
  sdkEventTypes,
} from "./models";
const sdkVersion = require("../package.json").version;

const DEFAULT_GTMUB_SDK_DC = "eu";

class Gtmhub {
  private pluginId = "";
  private dc: GtmhubSdkDc = DEFAULT_GTMUB_SDK_DC;

  private promiseMap: {
    [method: string]: {
      resolve(value): void;
      reject(reason): void;
    };
  } = {};

  private callbackMap: {
    [method: string]: (payload) => {};
  } = {};

  constructor({ pluginId }) {
    this.pluginId = pluginId;

    this.postMessage<GtmhubSdkDc>("getDc").then((dc) => (this.dc = dc));

    window.addEventListener("message", (event) => {
      const { type, data } = event.data;

      if (!type) {
        return;
      }

      const shouldNotifyPluginOnEventTypes = [
        "onGoalUpdated",
        "onMetricUpdated",
      ];
      if (shouldNotifyPluginOnEventTypes.indexOf(type) > -1) {
        const eventCallback = this.callbackMap[type];
        eventCallback && eventCallback(data);
        return;
      }

      // messages can come from different origins, so make sure:
      const isMessageTypeSupportedBySdk = sdkEventTypes.includes(type);
      const isMessageExpected = !!this.promiseMap[type];
      if (!isMessageExpected) {
        // 1.) we only respond to supported event types
        if (!isMessageTypeSupportedBySdk) {
          this.notifyMessageTypeNotSupported(type);
          return;
        }
        // 2) we only respond to expected event types
        if (isMessageTypeSupportedBySdk) {
          this.notifyMessageTypeNotExpected(type);
          return;
        }
      }

      /** some endpoints don't return data (DELETE,PATCH) */
      if (data && data.error) {
        return this.promiseMap[type].reject(data);
      }

      return this.promiseMap[type].resolve(data);
    });
  }

  /** METRICS */
  getMetric = (id: string): Promise<unknown> =>
    this.postMessage("getMetric", { id });
  getMetrics = (id: string): Promise<unknown> =>
    this.postMessage("getMetrics", { id });
  deleteMetric = (id: string): Promise<unknown> =>
    this.postMessage("deleteMetric", { id });
  createMetric = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("createMetric", { payload });
  updateMetric = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("updateMetric", { payload });
  checkinMetric = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("checkinMetric", { payload });
  patchMetricComment = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("patchMetricComment", { payload });
  createMetricReaction = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("createMetricReaction", { payload });
  deleteMetricReaction = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("deleteMetricReaction", { payload });
  deleteMetricSnapshot = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("deleteMetricSnapshot", { payload });
  onMetricUpdated = (cb: (payload: Record<string, unknown>) => {}) => {
    this.callbackMap["onMetricUpdated"] = cb;
  };

  /** GOALS */
  getGoal = (id: string): Promise<unknown> =>
    this.postMessage("getGoal", { id });
  getGoals = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("getGoals", { payload });
  deleteGoal = (id: string): Promise<unknown> =>
    this.postMessage("deleteGoal", { id });
  createGoal = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("createGoal", { payload });
  updateGoal = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("updateGoal", { payload });
  onGoalUpdated = (cb: (payload: Record<string, unknown>) => {}) => {
    this.callbackMap["onGoalUpdated"] = cb;
  };

  /** TASKS */
  getTask = (id: string): Promise<unknown> =>
    this.postMessage("getTask", { id });
  getTasks = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("getTasks", { payload });
  deleteTask = (id: string): Promise<unknown> =>
    this.postMessage("deleteTask", { id });
  createTask = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("createTask", { payload });
  updateTask = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("updateTask", { payload });

  /** USERS */
  getUser = (id: string): Promise<unknown> =>
    this.postMessage("getUser", { id });
  getUsers = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("getUsers", { payload });
  getCurrentUser = (): Promise<unknown> => this.postMessage("getCurrentUser");
  deleteUser = (id: string): Promise<unknown> =>
    this.postMessage("deleteUser", { id });
  createUser = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("createUser", { payload });
  updateUser = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("updateUser", { payload });

  /** TEAMS */
  getTeam = (id: string): Promise<unknown> =>
    this.postMessage("getTeam", { id });
  getTeams = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("getTeams", { payload });
  deleteTeam = (id: string): Promise<unknown> =>
    this.postMessage("deleteTeam", { id });
  createTeam = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("createTeam", { payload });
  updateTeam = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("updateTeam", { payload });

  /** SESSIONS */
  getSession = (id: string): Promise<unknown> =>
    this.postMessage("getSession", { id });

  /** SETTINGS */
  getSettings = () => this.postMessage<Setting[]>("getSettings");
  getSetting = (id: string) => this.postMessage<Setting>("getSetting", { id });

  updateCurrentItem = (data: unknown): Promise<unknown> =>
    this.postMessage("updateCurrentItem", data);
  getCurrentItem = (): Promise<unknown> => this.postMessage("getCurrentItem");
  linkIssue = (issue): Promise<unknown> => this.postMessage("linkIssue", issue);

  getAccountId = (): Promise<string> => this.postMessage("getAccountId");
  getAccountUrl = (): Promise<string> => this.postMessage("getAccountUrl");
  getAccountSettings = (): Promise<unknown> =>
    this.postMessage("getAccountSettings");
  getAssigneeById = (id: string): Promise<unknown> =>
    this.postMessage("getAssigneeById", { id });
  getAssigneesByIds = (payload: Record<string, unknown>): Promise<unknown> =>
    this.postMessage("getAssigneesByIds", { payload });
  getCustomFields = (): Promise<unknown> => this.postMessage("getCustomFields");

    /** CUSTOM SDK ERRORS */
    onEventTypeNotSupported = (cb: (payload: Record<string, unknown>) => {}) => {
      this.callbackMap["onEventTypeNotSupported"] = cb;
    };
    onEventTypeNotExpected = (cb: (payload: Record<string, unknown>) => {}) => {
      this.callbackMap["onEventTypeNotExpected"] = cb;
    };
  
    private notifyMessageTypeNotSupported = (messageType: string) => {
      const payload = {
        messageType,
        sdkVersion,
      };
  
      const green = "\x1b[32m";
      const blue = "\x1b[34m";
      const reset = "\x1b[0m";
      const notSupportedMsg = `Event with name '${blue}${messageType}${reset}' is not supported in the current ${blue}${sdkVersion}${reset} SDK version, please upgrade SDK to the latest one.`;
      console.log(`${green}Gtmhub SDK:${reset} ${notSupportedMsg}`);
  
      const eventCallback = this.callbackMap["onEventTypeNotSupported"];
      eventCallback && eventCallback(payload);
      this.postMessage("onEventTypeNotSupported", { payload });
    };
    private notifyMessageTypeNotExpected = (messageType: string) => {
      const payload = {
        messageType,
      };
  
      const green = "\x1b[32m";
      const blue = "\x1b[34m";
      const reset = "\x1b[0m";
      const notSupportedMsg = `Unexpected event with name '${blue}${messageType}${reset}'`;
      console.log(`${green}Gtmhub SDK:${reset} ${notSupportedMsg}`);
  
      const eventCallback = this.callbackMap["onEventTypeNotExpected"];
      eventCallback && eventCallback(payload);
      this.postMessage("onEventTypeNotExpected", { payload });
    };

  resize = (payload: { height: number }): Promise<string> =>
    this.postMessage("resize", { payload });

  request = (options: {
    url: string;
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
    params?: Record<string, unknown>;
    data?: unknown;
    headers?: AxiosRequestHeaders;
  }): Promise<unknown> => {
    const urlObject = new URL(options.url);
    const newUrl = getProxyUrl(this.dc) + urlObject.pathname;

    return axios({
      method: options.method,
      url: newUrl,
      headers: options.headers,
      data: options.data,
      params: {
        pluginVersionId: this.pluginId,
        host: `${urlObject.protocol}//${urlObject.host}`,
        ...options.params,
      },
    });
  };

  postMessage<T>(type: SdkEventType, data?): Promise<T> {
    window.parent.postMessage(
      {
        type,
        data: {
          ...data,
          pluginSettings: {
            pluginId: this.pluginId,
          },
        },
      },
      "*"
    );

    return new Promise<T>((resolve, reject) => {
      this.promiseMap[type] = {
        resolve,
        reject,
      };
    });
  }
}

const getProxyUrl = (dc: GtmhubSdkDc) => {
  if (dc === "staging") {
    return "https://plugins.staging.gtmhub.com";
  }

  if (dc === "eu") {
    return "https://plugins.gtmhub.com";
  }

  return `https://plugins.${dc}.gtmhub.com`;
};

export const initialiseSdk = ({ pluginId }) => new Gtmhub({ pluginId });
