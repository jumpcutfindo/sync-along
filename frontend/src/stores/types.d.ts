declare module "Types" {
    import { StateType } from "typesafe-actions";

    export type RootState = StateType<typeof import("src/stores").rootReducer>;
    export type AppDispatch = typeof import("src/stores").default.dispatch;
}
