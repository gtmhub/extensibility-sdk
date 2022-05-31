import axios, { AxiosRequestHeaders } from "axios";

type EventType = "linkIssue" | "getCurrentItem" | "updateCurrentItem" | GeneralEvents | PluginEvents | MetricEvents | GoalEvents | TaskEvents | SessionEvents | UserEvents | AccountEvents | TeamEvents;
type MetricEvents = "getMetrics" | "getMetric" | "createMetric" | "updateMetric" | "deleteMetric" | "checkinMetric";
type GoalEvents = "getGoal" | "getGoals" | "createGoal" | "updateGoal" | "deleteGoal";
type TaskEvents = "getTask" | "getTasks" | "createTask" | "updateTask" | "deleteTask";
type UserEvents = "getUser" | "getUsers" | "getCurrentUser" | "createUser" | "updateUser" | "deleteUser";
type AccountEvents = "getAccountId";
type TeamEvents = "getTeam" | "getTeams" | "createTeam" | "updateTeam" | "deleteTeam";
type PluginEvents = "getSetting" | "getSettings";
type SessionEvents = "getSession";
type GeneralEvents = "getDc" | "resize";
type Setting = { key: string; value: string };

type dc = "us" | "eu" | "staging";
class Gtmhub {
  pluginId = "";
  dc;

  promiseMap: {
    [method: string]: {
      resolve: (value) => void;
      reject: (reason) => void;
    };
  } = {};

  constructor({ pluginId }) {
    this.pluginId = pluginId;

    if (!this.dc) {
      this.postMessage("getDc").then((dc) => (this.dc = dc));
    }

    window.addEventListener("message", (event) => {
      const { type, data } = event.data;

      // messages can come from different origins, so make sure
      // we use only expected ones
      if (!type) {
        return;
      }

      /** some endpoints doesn't return data (DELETE,PATCH) */
      if (data && data.error) {
        return this.promiseMap[type].reject(data);
      }

      return this.promiseMap[type].resolve(data);
    });
  }

  /** METRICS */
  getMetric = (id: string): Promise<unknown> => this.postMessage("getMetric", { id });
  getMetrics = (id: string): Promise<unknown> => this.postMessage("getMetrics", { id });
  deleteMetric = (id: string): Promise<unknown> => this.postMessage("deleteMetric", { id });
  createMetric = (payload): Promise<unknown> => this.postMessage("createMetric", { payload });
  updateMetric = (payload): Promise<unknown> => this.postMessage("updateMetric", { payload });
  checkinMetric = (payload): Promise<unknown> => this.postMessage("checkinMetric", { payload });

  /** GOALS */
  getGoal = (id: string): Promise<unknown> => this.postMessage("getGoal", { id });
  getGoals = (payload): Promise<unknown> => this.postMessage("getGoals", { payload });
  deleteGoal = (id: string): Promise<unknown> => this.postMessage("deleteGoal", { id });
  createGoal = (payload): Promise<unknown> => this.postMessage("createGoal", { payload });
  updateGoal = (payload): Promise<unknown> => this.postMessage("updateGoal", { payload });

  /** TASKS */
  getTask = (id: string): Promise<unknown> => this.postMessage("getTask", { id });
  getTasks = (payload): Promise<unknown> => this.postMessage("getTasks", { payload });
  deleteTask = (id: string): Promise<unknown> => this.postMessage("deleteTask", { id });
  createTask = (payload): Promise<unknown> => this.postMessage("createTask", { payload });
  updateTask = (payload): Promise<unknown> => this.postMessage("updateTask", { payload });

  /** USERS */
  getUser = (id: string): Promise<unknown> => this.postMessage("getUser", { id });
  getUsers = (payload): Promise<unknown> => this.postMessage("getUsers", { payload });
  getCurrentUser = (): Promise<unknown> => this.postMessage("getCurrentUser");
  deleteUser = (id: string): Promise<unknown> => this.postMessage("deleteUser", { id });
  createUser = (payload): Promise<unknown> => this.postMessage("createUser", { payload });
  updateUser = (payload): Promise<unknown> => this.postMessage("updateUser", { payload });

  /** TEAMS */
  getTeam = (id: string): Promise<unknown> => this.postMessage("getTeam", { id });
  getTeams = (payload): Promise<unknown> => this.postMessage("getTeams", { payload });
  deleteTeam = (id: string): Promise<unknown> => this.postMessage("deleteTeam", { id });
  createTeam = (payload): Promise<unknown> => this.postMessage("createTeam", { payload });
  updateTeam = (payload): Promise<unknown> => this.postMessage("updateTeam", { payload });

  /** SESSIONS */
  getSession = (id: string): Promise<unknown> => this.postMessage("getSession", { id });

  /** SETTINGS */
  getSettings = () => this.postMessage<Setting[]>("getSettings");
  getSetting = (id: string) => this.postMessage<Setting>("getSetting", { id });

  updateCurrentItem = (data: unknown): Promise<unknown> => this.postMessage("updateCurrentItem", data);
  getCurrentItem = (): Promise<unknown> => this.postMessage("getCurrentItem");
  linkIssue = (issue): Promise<unknown> => this.postMessage("linkIssue", issue);

  getAccountId = (): Promise<string> => this.postMessage("getAccountId");

  resize = (payload: { height: number }): Promise<string> => this.postMessage("resize", { payload });

  request = (options: { url: string; method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"; params?: Record<string, unknown>; data?: unknown; headers?: AxiosRequestHeaders }): Promise<unknown> => {
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

  postMessage<T>(type: EventType, data?): Promise<T> {
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

const getProxyUrl = (dc: dc) => {
  if (dc === "eu") {
    return "https://plugins.gtmhub.com";
  }
  if (dc === "us") {
    return "https://plugins.us.gtmhub.com";
  }

  return "https://plugins.staging.gtmhub.com";
};

export const initialiseSdk = ({ pluginId }) => new Gtmhub({ pluginId });
