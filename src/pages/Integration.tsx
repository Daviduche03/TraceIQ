import React from 'react';
import { Code2, Copy, Check } from 'lucide-react';

const frameworks = {
  'React': {
    install: 'npm install @error-tracker/react',
    setup: `import { ErrorProvider } from '@error-tracker/react';

function App() {
  return (
    <ErrorProvider 
      projectId="YOUR_PROJECT_ID"
      environment="production"
    >
      <YourApp />
    </ErrorProvider>
  );
}`,
    usage: `// Automatic error boundary
import { withErrorTracking } from '@error-tracker/react';

export default withErrorTracking(YourComponent);

// Manual error tracking
import { useErrorTracker } from '@error-tracker/react';

function Component() {
  const { trackError } = useErrorTracker();
  
  try {
    // Your code
  } catch (error) {
    trackError(error);
  }
}`
  },
  'Next.js': {
    install: 'npm install @error-tracker/next',
    setup: `// pages/_app.tsx
import { ErrorProvider } from '@error-tracker/next';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorProvider
      projectId="YOUR_PROJECT_ID"
      environment="production"
    >
      <Component {...pageProps} />
    </ErrorProvider>
  );
}`,
    usage: `// Middleware for API routes
import { withErrorTracking } from '@error-tracker/next';

export default withErrorTracking(handler);

// Client-side tracking
import { useErrorTracker } from '@error-tracker/next';

export default function Page() {
  const { trackError } = useErrorTracker();
  // Use trackError in your code
}`
  },
  'Vue': {
    install: 'npm install @error-tracker/vue',
    setup: `// main.js
import { createApp } from 'vue';
import { ErrorTracker } from '@error-tracker/vue';

const app = createApp(App);
app.use(ErrorTracker, {
  projectId: 'YOUR_PROJECT_ID',
  environment: 'production'
});`,
    usage: `// Composition API
import { useErrorTracker } from '@error-tracker/vue';

export default {
  setup() {
    const { trackError } = useErrorTracker();
    
    return {
      handleError(error) {
        trackError(error);
      }
    }
  }
}`
  },
  'Express': {
    install: 'npm install @error-tracker/express',
    setup: `const express = require('express');
const { errorTracker } = require('@error-tracker/express');

const app = express();

app.use(errorTracker({
  projectId: 'YOUR_PROJECT_ID',
  environment: 'production'
}));`,
    usage: `// Global error handler
app.use((error, req, res, next) => {
  // Errors are automatically tracked
  res.status(500).json({ error: 'Internal Server Error' });
});

// Manual tracking
const { trackError } = require('@error-tracker/express');

app.get('/api/data', async (req, res) => {
  try {
    // Your code
  } catch (error) {
    trackError(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});`
  }
};

export function Integration() {
  const [copied, setCopied] = React.useState(false);
  const [selectedFramework, setSelectedFramework] = React.useState('React');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Integration Guide</h1>
        <p className="text-gray-400">Set up error tracking in your application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {Object.keys(frameworks).map((framework) => (
            <button
              key={framework}
              onClick={() => setSelectedFramework(framework)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedFramework === framework
                  ? 'bg-indigo-500 text-white'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              {framework}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold text-white mb-4">1. Installation</h2>
            <div className="bg-black rounded-lg p-4 relative group">
              <code className="text-gray-300 font-mono">{frameworks[selectedFramework as keyof typeof frameworks].install}</code>
              <button
                onClick={() => handleCopy(frameworks[selectedFramework as keyof typeof frameworks].install)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold text-white mb-4">2. Setup</h2>
            <div className="bg-black rounded-lg p-4 font-mono text-sm text-gray-300 relative group">
              <pre className="whitespace-pre-wrap">{frameworks[selectedFramework as keyof typeof frameworks].setup}</pre>
              <button
                onClick={() => handleCopy(frameworks[selectedFramework as keyof typeof frameworks].setup)}
                className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold text-white mb-4">3. Usage</h2>
            <div className="bg-black rounded-lg p-4 font-mono text-sm text-gray-300 relative group">
              <pre className="whitespace-pre-wrap">{frameworks[selectedFramework as keyof typeof frameworks].usage}</pre>
              <button
                onClick={() => handleCopy(frameworks[selectedFramework as keyof typeof frameworks].usage)}
                className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}