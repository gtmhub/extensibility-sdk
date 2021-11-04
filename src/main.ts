import axios, { AxiosRequestHeaders } from "axios";

type EventType = "linkIssue" | "getCurrentItem" | "updateCurrentItem" | "getSettings" | MetricEvents | GoalEvents | TaskEvents | SessionEvents | UserEvents | TeamEvents;
type MetricEvents = "getMetrics" | "getMetric" | "createMetric" | "updateMetric" | "deleteMetric";
type GoalEvents = "getGoal" | "getGoals" | "createGoal" | "updateGoal" | "deleteGoal";
type TaskEvents = "getTask" | "getTasks" | "createTask" | "updateTask" | "deleteTask";
type UserEvents = "getUser" | "getUsers" | "createUser" | "updateUser" | "deleteUser";
type TeamEvents = "getTeam" | "getTeams" | "createTeam" | "updateTeam" | "deleteTeam";
type SessionEvents = "getSession";

class Gtmhub {
  pluginId = "";
  pluginPw = "";

  promiseMap: { [method: string]: { resolve: (data: unknown) => unknown; reject: (error: unknown) => unknown } } = {};

  constructor({ pluginId, pluginPw }) {
    this.pluginId = pluginId;
    this.pluginPw = pluginPw;

    window.addEventListener("message", (event) => {
      const { type, data } = event.data;

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

  updateCurrentItem = (data: unknown): Promise<unknown> => this.postMessage("updateCurrentItem", data);
  getCurrentItem = (): Promise<unknown> => this.postMessage("getCurrentItem");
  getSettings = (): Promise<unknown> => this.postMessage("getSettings");
  linkIssue = (issue): Promise<unknown> => this.postMessage("linkIssue", issue);

  request = (options: { url: string; method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"; params: Record<string, unknown>; headers: AxiosRequestHeaders }): Promise<unknown> => {
    const urlObject = new URL(options.url);

    // TODO: the url should respect the hosting environment
    const newUrl = "https://app.staging.gtmhub.com/webapp-plugins-proxy" + urlObject.pathname;

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

    return new Promise((resolve, reject) => {
      this.promiseMap[type] = {
        resolve,
        reject,
      };
    });
  }
}

window["initializeSdk"] = ({ pluginId, pluginPw }) => {
  /** TODO: add handler which gets the plugin secrets from an api and initialise it with them */
  return new Gtmhub({ pluginId, pluginPw });
};
