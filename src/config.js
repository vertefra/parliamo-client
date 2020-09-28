const albert_auth_server = "http://127.0.0.1:3003";
const isaac_query_service = "http://127.0.0.1:3002";
const chat_server = "http://127.0.0.1:5000";

const compareFunction = (a, b) => {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else {
    return -1;
  }
};

export {
  albert_auth_server,
  chat_server,
  isaac_query_service,
  compareFunction,
};
