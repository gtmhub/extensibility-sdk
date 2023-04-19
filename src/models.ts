const customSdkErrorEvents = [
  "onEventTypeNotSupported",
  "onEventTypeNotExpected",
];
export type CustomSdkErrorEvents = typeof customSdkErrorEvents[number];

const generalEvents = [
  "getDc",
  "resize",
  "getAssigneeById",
  "getAssigneesByIds",
];
export type GeneralEvents = typeof generalEvents[number];

const currentItemEvents = ["getCurrentItem", "updateCurrentItem"];
export type CurrentItemEvents = typeof currentItemEvents[number];

const taskEvents = [
  "getTask",
  "getTasks",
  "createTask",
  "updateTask",
  "deleteTask",
] as const;
export type TaskEvents = typeof taskEvents[number];

const metricEvents = [
  "getMetrics",
  "getMetric",
  "createMetric",
  "updateMetric",
  "deleteMetric",
  "checkinMetric",
  "patchMetricComment",
  "createMetricReaction",
  "deleteMetricReaction",
  "deleteMetricSnapshot",
  "onMetricUpdated",
];
export type MetricEvents = typeof metricEvents[number];

const goalEvents = [
  "getGoal",
  "getGoals",
  "createGoal",
  "updateGoal",
  "deleteGoal",
  "onGoalUpdated",
];
export type GoalEvents = typeof goalEvents[number];

const sessionEvents = ["getSession"];
export type SessionEvents = typeof sessionEvents[number];

const pluginEvents = ["getSetting", "getSettings"];
export type PluginEvents = typeof pluginEvents[number];

const userEvents = [
  "getUser",
  "getUsers",
  "getCurrentUser",
  "createUser",
  "updateUser",
  "deleteUser",
];
export type UserEvents = typeof userEvents[number];

const teamEvents = [
  "getTeam",
  "getTeams",
  "createTeam",
  "updateTeam",
  "deleteTeam",
];
export type TeamEvents = typeof teamEvents[number];

const accountEvents = [
  "getAccountId",
  "getAccountUrl",
  "getAccountSettings",
  "getCustomFields",
];
export type AccountEvents = typeof accountEvents[number];

export type Setting = { key: string; value: string };

export const gtmhubDataCenters = [
  "eu",
  "us",
  "us2",
  "as",
  "af",
  "sa",
  "au",
] as const;
type GtmhubDc = typeof gtmhubDataCenters[number];
export type GtmhubSdkDc = "staging" | GtmhubDc;

export const sdkEventTypes = [
  ...customSdkErrorEvents,
  ...generalEvents,
  ...currentItemEvents,
  ...taskEvents,
  ...metricEvents,
  ...goalEvents,
  ...sessionEvents,
  ...pluginEvents,
  ...userEvents,
  ...teamEvents,
  ...accountEvents,
] as const;
export type SdkEventType = typeof sdkEventTypes[number] | "linkIssue";
