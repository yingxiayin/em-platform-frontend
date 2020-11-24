import request from '@/utils/request';
import { LoginParams } from '@/models/user';

export async function accountLogin(params: LoginParams) {
  const { uid, password } = params;
  const data = { uid, password };
  
  console.log(data);

  return request('/api/login', {
    method: 'POST',
    data,
  })
    .then(function(response) {
      console.log(response);
      return response;
    })
    .catch(function(error) {
      console.log(error);
    });
}
