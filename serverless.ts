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
      authenticationType: "AWS_LAMBDA", // API_KEY or AWS_IAM or AMAZON_COGNITO_USER_POOLS or OPENID_CONNECT or AWS_LAMBDA
      schema: "./graphql/schema.graphql", // schemaファイルのパス。複数ファイルや正規表現(glob)もOK
      // falseにしておくと、lambdaの呼び出しがデフォルトになります。
      // dynamoDBや他のものがメインの場合は基本となるvtlを指定しておくと楽かもしれませんね
      defaultMappingTemplates: {
        request: false,
        response: false,
      },
      lambdaAuthorizerConfig: {
        functionName: "sampleAuth",
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
    sampleAuth: {
      handler: "src/handler.sampleAuth",
    },
  },
};

module.exports = serverlessConfiguration;
