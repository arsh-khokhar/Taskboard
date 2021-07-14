let api_base_url = "https://taskboard-back-end.herokuapp.com/api";
let login_end = "/users/login";
let task_reorder = "/tasks/reorder";
let task_update = "/tasks/update";
let task_delete = "/tasks/delete";
let boards = "/boards";
let add_collab = "/add_collab";

const apiEndPoints = {
  API_URL: api_base_url,
  LOGIN: api_base_url + login_end,
  REGISTER: api_base_url + "/users/register",
  TASK_REORDER: api_base_url + task_reorder,
  BOARDS: api_base_url + boards,
  ADD_COLLAB: add_collab,
  REMOVE_COLLAB: "/remove_collab",
  UPDATE: "/update",
  TASKS: api_base_url + "/tasks",
  TASK_UPDATE: api_base_url + task_update,
  TASK_DELETE: api_base_url + task_delete,
  LISTS: api_base_url + "/lists",
  LIST_UPDATE: api_base_url + "/lists/update",
  LIST_DELETE: api_base_url + "/lists/delete",
  BOARD_DELETE: api_base_url + boards + "/delete"
};

const authHeaderKeys = {
  USER: "auth-user",
  TOKEN: "auth-token",
  LOGIN_BOOL: "isLoggedIn"
};

const tbConsts = {apiEndPoints: apiEndPoints, authHeaderKeys: authHeaderKeys};

export default tbConsts;
