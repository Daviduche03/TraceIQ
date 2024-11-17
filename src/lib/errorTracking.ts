import { ErrorTracker } from './error-tracker';

export const errorTracker = new ErrorTracker({
  projectId: 'c8086d79-4393-4637-ad9c-f7a95f24e8d3',
  apiKey: 'et_live_0kxnplNwDCC4vGpl0ddk8izxeUny3mgR',
  environment: import.meta.env.MODE // 'development' or 'production'
});