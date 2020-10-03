GNU nano 4.8                                                                                    src/config.js                                                                                               
const compareFunction = (a, b) => {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else {
    return -1;
  }
};

const albert_auth_server = "http://68.183.126.73:3003";
const isaac_query_service = "http://68.183.126.73:3002";
const leonardo_chat_server = "http://68.183.126.73:5000";

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




