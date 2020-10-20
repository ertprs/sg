import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import * as userActions from './store/actions/user';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Collect from './pages/Collect';
import ImportCollects from './pages/ImportCollects';
import Companie from './pages/Companie';
import Attendance from './pages/Attendance'
import NotFound from './pages/NotFound';
import Client from './pages/Client';
import User from './pages/User';
import Billet from './pages/Billet';

function Routes(props) {

    useEffect(() => {
        props.dispatch(userActions.setUser(localStorage.getItem('@sg/user/id'), localStorage.getItem('@sg/user/name'), localStorage.getItem('@sg/user/hash')));
    }, []);

    return (
        <BrowserRouter>
            {props.state.user.id < 1 ?
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path='*' component={NotFound} />
                </Switch>
                :
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/attendance" component={Attendance} />
                    <Route exact path="/collect" component={Collect} />
                    <Route exact path="/import-collects" component={ImportCollects} />
                    <Route exact path="/companie" component={Companie} />
                    <Route exact path="/client" component={Client} />
                    <Route exact path="/user" component={User} />
                    <Route exact path="/billet" component={Billet} />
                </Switch>
            }
        </BrowserRouter>
    );
}
export default connect(state => ({ state }))(Routes);
