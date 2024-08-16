
const serverlessConfiguration = {
  service: 'serverless-template',
  frameworkVersion: '3',
  plugins: [
    'serverless-plugin-typescript',
    'serverless-stack-output',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs10.x',
    stage: process.env.STAGE || 'dev',
    region: 'eu-west-1',
  },
  custom: {
    stage: process.env.STAGE || 'dev',
    output: {
      file: '.serverless/output.json',
    },
  },
  resources: {
    Outputs: {
      ApiUrl: {
        Description: 'The API Gateway URL',
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              { Ref: 'ApiGatewayRestApi' },
              `.execute-api.${process.env.AWS_REGION || 'eu-west-1'}.amazonaws.com/\${process.env.STAGE || 'dev'}`,
            ],
          ],
        },
      },
    },
  },
  functions: {
    healthcheck: {
      handler: 'src/functions/healthcheck.healthcheck',
      description: 'Healthcheck to ensure the service is up',
      events: [
        {
          http: {
            path: 'healthcheck',
            method: 'get',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
