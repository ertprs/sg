import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Client from './pages/Client';
import ImportClient from './pages/ImportClient';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/client" component={Client} />
                <Route exact path="/import-client" component={ImportClient} />
            </Switch>
        </BrowserRouter>
    );
}
