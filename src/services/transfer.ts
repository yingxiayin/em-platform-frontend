import request from '@/utils/request';

export async function fetchImageTransfer(uid: string, rawUrl: string, styleUrl: string) {
  const data = { uid, rawUrl, styleUrl };
  return request('/api/image/transfer', {
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
