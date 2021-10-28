import React, { useState } from "react";

const useTextAreaState = (initialState: string) => {
    const [input, setInput] = useState(initialState);
    const updateState = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
        setInput(event.currentTarget.value);
    const clearInput = () => setInput("");

    return [input, updateState, clearInput] as const;
};

export default useTextAreaState;
