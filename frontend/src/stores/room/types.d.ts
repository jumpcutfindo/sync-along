declare module "Types" {
    import { StateType } from "typesafe-actions";
    import store from "../index";

    export type RootState = StateType<typeof store>;
    export type AppDispatch = typeof store.dispatch;
}
