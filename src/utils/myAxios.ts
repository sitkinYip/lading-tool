import { AxiosRequestConfig } from 'axios';
import service from './request';

const myAxios = function (option: AxiosRequestConfig) {
  return new Promise(function(resolve, reject){
    const apis = service;
    apis.request(option).then(res =>{
      let data = res.data
      resolve(data)
    }).catch(res => {
      reject(res)
    })
  });
};
export default myAxios