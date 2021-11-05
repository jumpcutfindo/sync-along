/* eslint-disable @typescript-eslint/no-empty-interface */
interface ValidationResult {
    valid: boolean;
    error?: string;
}

interface RegistrationValidationResult extends ValidationResult {}
interface LoginValidationResult extends ValidationResult {}
interface RoomCodeValidationResult extends ValidationResult {}
interface ChatValidationResult extends ValidationResult {}
interface AddMediaValidationResult extends ValidationResult {}

export const validateRegistrationInput = (
    username: string,
    password: string,
    retypePassword: string
): RegistrationValidationResult => {
    if (username === "") {
        return { valid: false, error: "Please enter a username!" };
    }
    if (password === "") {
        return { valid: false, error: "Please enter a password!" };
    }
    if (retypePassword === "") {
        return { valid: false, error: "Please retype your password!" };
    }
    if (password !== retypePassword) {
        return { valid: false, error: "The passwords do not match!" };
    }
    return { valid: true };
};

export const validateLoginInput = (
    username: string,
    password: string
): LoginValidationResult => {
    if (username === "" || password === "") {
        return { valid: false, error: "Please enter a username and password!" };
    }

    return { valid: true };
};

export const validateRoomCode = (
    roomCode: string
): RoomCodeValidationResult => {
    if (roomCode === null || roomCode === "" || roomCode === undefined)
        return { valid: false, error: "Please enter a room code!" };

    if (roomCode.length < 5)
        return {
            valid: false,
            error: "Room code should be at least 5 characters!",
        };

    return { valid: true };
};

export const validateChatMessage = (
    chatMessage: string
): ChatValidationResult => {
    if (
        chatMessage === "" ||
        chatMessage === undefined ||
        chatMessage === null
    ) {
        return { valid: false, error: "Empty message detected!" };
    }

    return { valid: true };
};

export const validateAddMedia = (url: string): AddMediaValidationResult => {
    if (url === undefined || url === null || url === "")
        return { valid: false, error: "Please enter a YouTube URL!" };

    const p =
        /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

    const flag = url.match(p);
    if (flag) return { valid: true };
    return { valid: false, error: "Invalid URL has been entered!" };
};
