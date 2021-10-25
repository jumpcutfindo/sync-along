declare module "Types" {
    import { StateType } from "typesafe-actions";

    export type RootState = StateType<import("src/stores").rootReducer>;
    export type AppDispatch = typeof store.dispatch;
}
