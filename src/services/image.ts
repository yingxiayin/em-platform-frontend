import request from '@/utils/request';

export async function fetchStyleImageByUid(uid: string) {
  const data = { uid };
  return request('/api/image/style/get', {
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

export async function fetchDeleteStyleImage(uid: string, id: number) {
  const data = { uid, id };
  return request('/api/image/style/delete', {
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
