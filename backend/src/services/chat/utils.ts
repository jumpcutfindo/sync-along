import moment from "moment";

type FormattedMessage = {
    username: string;
    text: string;
    time: string;
};
export const formatMessage = (
    username: string,
    text: string
): FormattedMessage => ({
    username,
    text,
    time: moment().format("h:mm a"),
});
