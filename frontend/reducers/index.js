import { combineReducers } from 'redux'

import user from './user/user.reducer'
import summary from './summary/summary.reducer'

export default combineReducers({
    user,
    summary,
})