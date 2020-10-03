const albert_auth_server = "http://127.0.0.1:3003";
const isaac_query_service = "http://127.0.0.1:3002";
const leonardo_chat_server = "http://127.0.0.1:5000";

const compareFunction = (a, b) => {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else {
    return -1;
  }
};

const dateOptionsMsg = {
  day: "2-digit",
  month: "short",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export {
  dateOptionsMsg,
  albert_auth_server,
  leonardo_chat_server,
  isaac_query_service,
  compareFunction,
};
