type EventType =
  | "linkIssue"
  | "getCurrentGoal"
  | "getCurrentMetric"
  | "getCurrentItem"
  | "updateCurrentItem";

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
  return new Gtmhub({ pluginId, pluginPw });
};
