type EventType =
  | "linkIssue"
  | "getCurrentGoal"
  | "getCurrentMetric"
  | "getCurrentItem"
  | "updateCurrentItem";

class Gtmhub {
  promiseMap = {};

  postMessage(type: EventType, data?) {
    window.parent.postMessage({ type, data }, "*");
  }

  constructor() {
    window.addEventListener("message", (event) => {
      const { type, data } = event.data;
      this.promiseMap[type](data);
    });
  }

  updateCurrentItem(data: unknown): Promise<unknown> {
    const type = "updateCurrentItem";
    this.postMessage(type, data);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  }

  getCurrentMetric(): Promise<unknown> {
    const type = "getCurrentMetric";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  }

  getCurrentItem(): Promise<unknown> {
    const type = "getCurrentItem";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  }

  getCurrentGoal(): Promise<any> {
    const type = "getCurrentGoal";
    this.postMessage(type);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  }

  linkIssue(issue): Promise<any> {
    const type = "linkIssue";
    this.postMessage(type, issue);

    return new Promise((resolve) => {
      this.promiseMap[type] = resolve;
    });
  }
}

window["pluginSdk"] = new Gtmhub();
