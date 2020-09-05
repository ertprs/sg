import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Collect from './pages/Collect';
import ImportCollects from './pages/ImportCollects';
import Companie from './pages/Companie';
import Attendance from './pages/Attendance'
import NotFound from './pages/NotFound';
import Client from './pages/Client';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/attendance" component={Attendance} />
                <Route exact path="/collect" component={Collect} />
                <Route exact path="/import-collects" component={ImportCollects} />
                <Route exact path="/companie" component={Companie} />
                <Route exact path="/client" component={Client} />
                <Route path='*' component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}
