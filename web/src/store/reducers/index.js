import { combineReducers } from 'redux';

import loading from './loading';
import toast from './toast';

export default combineReducers ({
    loading,
    toast
})