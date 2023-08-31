import {API_BASE} from '@env';
import axios from 'axios';

export const POST = async (
  destination: string,
  body?: object,
  accessToken?: string,
) => {
  try {
    const config = {
      method: 'post',
      url: API_BASE + destination,
      headers: accessToken
        ? {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          }
        : {
            'Content-Type': 'application/json',
          },
      data: JSON.stringify(body),
    };
    // Alert.alert('[method] alert1 (config)' + JSON.stringify(config));
    // console.log(config, '[CONFIG] - axios.ts');
    const result = await axios(config);
    // Alert.alert('[method] alert1 (result)' + result);
    // console.log(result, '[POST] RESULT');
    return result.data;
  } catch (error: any) {
    // console.error(error.response, 'error from [method.tsSs]');
    // Alert.alert('[method] alert1 (error)' + error);
    throw error;
  }
};
