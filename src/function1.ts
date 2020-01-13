import { camelcase } from 'lodash';
export const handler = async event => {
    console.log("Hello World", camelcase("helloW_uea_AED"));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};
