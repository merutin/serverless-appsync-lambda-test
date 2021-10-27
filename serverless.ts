import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "serverless-appsync-lambda-test",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    appSync: {
      name: "appsync-sample-${opt:stage}", // AppSyncにデプロイするときの名前
      authenticationType: "API_KEY", // API_KEY or AWS_IAM or AMAZON_COGNITO_USER_POOLS or OPENID_CONNECT or AWS_LAMBDA
      schema: "./graphql/schema.graphql", // schemaファイルのパス。複数ファイルや正規表現(glob)もOK
      apiKeys: [
        {
          name: "test-api-key", // apiKeyの名前
          description: "AppSync test", // 説明
          expiresAfter: "30d", // 有効期限(デプロイしてから、どのくらいで期限切れになるか)。最大365d。
          // expiresAt: '2021-03-09T16:00:00+00:00' で指定すれば年月で指定できる
        },
      ],
      // falseにしておくと、lambdaの呼び出しがデフォルトになります。
      // dynamoDBや他のものがメインの場合は基本となるvtlを指定しておくと楽かもしれませんね
      defaultMappingTemplates: {
        request: false,
        response: false,
      },
      mappingTemplates: [
        // queryとdataSourceを結びつける部分
        {
          dataSource: "sample",
          type: "Query",
          field: "sample",
        },
      ],
      dataSources: [
        // lambdaをdataSourceに設定する部分。この設定をすることでAppSyncからlambdaを呼び出せる
        {
          type: "AWS_LAMBDA",
          name: "sample",
          config: {
            functionName: "sample",
          },
        },
      ],
    },
    "appsync-simulator": {
      location: ".webpack/service",
      apiKey: "da2-fakeApiId123456",
      watch: false,
    },
  },
  plugins: [
    "serverless-webpack",
    "serverless-appsync-simulator",
    "serverless-appsync-plugin",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: '${opt:stage, "local"}',
    region: "ap-northeast-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    lambdaHashingVersion: "20201221",
  },
  functions: {
    sample: {
      handler: "src/handler.sample",
    },
  },
};

module.exports = serverlessConfiguration;
