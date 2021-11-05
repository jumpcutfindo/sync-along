import moment from "moment";

export const formatMessage = (username, text) => ({
  username,
  text,
  time: moment().format("h:mm a"),
});
