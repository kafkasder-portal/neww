import React from 'react';
import { AlertTriangle, Settings, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Authentication Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error?.message.includes('CONFIGURATION ERROR')) {
      return <ConfigurationErrorFallback error={this.state.error} />;
    }

    if (this.state.hasError) {
      return <GenericAuthErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ConfigurationErrorFallback({ error }: { error?: Error }) {
  const handleConnectSupabase = () => {
    // This would trigger the MCP connection
    const event = new CustomEvent('open-mcp-popover', { detail: { server: 'Supabase' } });
    window.dispatchEvent(event);
  };

  const handleEnableMockMode = () => {
    // Show instructions for enabling mock mode
    const envContent = `# Add this to your .env file
VITE_MOCK_API=true

# Then restart the development server
npm run dev`;

    navigator.clipboard.writeText(envContent).then(() => {
      alert('Configuration copied to clipboard! Add this to your .env file and restart the server.');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Configuration Required</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              Supabase configuration is missing or invalid. This app requires a Supabase project to function.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Solutions:</h3>
            
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  Option 1: Connect to Supabase (Recommended)
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Automatically set up your Supabase project and configure the environment.
                </p>
                <Button onClick={handleConnectSupabase} className="w-full">
                  Connect to Supabase
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-green-600" />
                  Option 2: Manual Setup
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Create a Supabase project manually and update your .env file.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://supabase.com', '_blank')}
                  className="w-full"
                >
                  Go to Supabase
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Option 3: Development Mode</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Enable mock mode for development without Supabase.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={handleEnableMockMode}
                  className="w-full"
                >
                  Copy Mock Mode Config
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GenericAuthErrorFallback({ error }: { error?: Error }) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-900">Authentication Error</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            An error occurred while initializing the authentication system.
          </p>
          
          <Button onClick={handleRetry} className="w-full">
            Try Again
          </Button>

          {error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Error Details
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
