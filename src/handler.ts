import 'source-map-support/register';

import { AppSyncResolverHandler } from 'aws-lambda';

export const sample: AppSyncResolverHandler<any, any> = async (event) => {
  console.log("event", event);

  return "OK";
}
