import {all} from 'redux-saga/effects';
import { authSagas } from '../screens/auth/sagas';


// SAGAS




export default function* rootSaga() {
  yield all([
    ...authSagas,
   
    
    
  ]);
}
