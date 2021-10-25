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
      name: "appsync-sample", // AppSyncにデプロイするときの名前。stageの値が追加で付与される
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
      defaultMappingTemplates: {
        request: false,
        response: false,
      },
      mappingTemplatesLocation: "./graphql/mapping-template",
      mappingTemplates: [
        {
          dataSource: "sample",
          type: "Query",
          field: "sample",
        },
      ],
      functionConfigurations: [
        {
          name: "sample",
          dataSource: "sample",
        },
      ],
      dataSources: [
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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: {
    sample: {
      handler: "src/handler.sample",
    },
  },
};

module.exports = serverlessConfiguration;
