import {takeLatest, call, put} from 'redux-saga/effects';
import {
  startLogin,
  loginSuccess,
  loginFailure,
  sendOtpFailed,
} from './reducers';
import {requestLoginOtpApi} from './services';
import {Logger} from '../../utils/logger';
import {showCustomNotification} from '../../components/customNotification/reducers';

function* requestLoginOtpSaga(action) {
  try {
    const response = yield call(requestLoginOtpApi, action.payload);

    if (response.status === 201) {
      yield put(loginSuccess());

      //   yield put(showCustomNotification({
      //     message: response.message, // Use the message from the response
      //     type: 'success',           // Optional, set notification type
      //     isTop: true,               // Optional, position of the notification (top or bottom)
      //   }));
    } else {
      yield put(
        showCustomNotification({
          message: response.data.message, // Use the error message from response
          type: 'failure', // Optional, set notification type
          isTop: false, // Optional, position of the notification (top or bottom)
        }),
      );
    }
  } catch (error) {
    // In case of an error, dispatch failure
    yield put(sendOtpFailed());

    // Dispatch failure notification
    yield put(
      showCustomNotification({
        message: error.message || 'Something went wrong', // Use error message if available
        type: 'failure', // Optional, set notification type
        // Optional, position of the notification (top or bottom)
      }),
    );

    // Logger.error('Login API call failed', error);
  } finally {
    // Logger.info('Login saga completed');
  }
}

export const authSagas = [takeLatest(startLogin.type, requestLoginOtpSaga)];
