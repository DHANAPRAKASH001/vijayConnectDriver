import {mainAxios} from '../../api';

export const requestLoginOtpApi = async payload => {
  const response = await mainAxios.post('/auth/otp', payload);
  return response;
};
