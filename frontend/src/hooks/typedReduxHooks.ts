import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import Types from "Types";

export const useAppDispatch = () => useDispatch<Types.AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<Types.RootState> =
    useSelector;
