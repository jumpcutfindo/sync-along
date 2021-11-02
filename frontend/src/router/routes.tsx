import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAppSelector } from "src/hooks/typedReduxHooks";

export const PrivateRoute: React.FC<{ path: string; component: React.FC }> = (
    props
) => {
    const { path, component } = props;

    const isLoggedIn = useAppSelector((state) => state.app.loggedIn);

    if (!isLoggedIn) return <Redirect to="/login" />;
    return <Route path={path} component={component} />;
};

export const PublicRoute: React.FC<{ path: string; component: React.FC }> = (
    props
) => {
    const { path, component } = props;

    const isLoggedIn = useAppSelector((state) => state.app.loggedIn);

    if (isLoggedIn) return <Redirect to="/dashboard" />;
    return <Route path={path} component={component} />;
};
