import { combineReducers } from 'redux';

import loading from './loading';
import toast from './toast';
import callback from './callback';

export default combineReducers ({
    loading,
    toast,
    callback
})