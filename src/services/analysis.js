import { stringify } from 'qs';
import request from '../utils/request';

export async function queryData(params) {
  return request('/api/analysis/queryData', {
    method: 'POST',
    body: params,
  });
}