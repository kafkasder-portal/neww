import { Info, Settings } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { shouldUseMockAuth } from '../lib/mockAuth';

export function DevelopmentNotice() {
  if (!shouldUseMockAuth()) {
    return null;
  }

  const handleConnectSupabase = () => {
    // This would trigger the MCP connection
    const event = new CustomEvent('open-mcp-popover', { detail: { server: 'Supabase' } });
    window.dispatchEvent(event);
  };

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong className="text-blue-800">Development Mode:</strong>{' '}
          <span className="text-blue-700">
            Using mock authentication. Login with <code className="bg-blue-100 px-1 rounded">demo@example.com</code> / <code className="bg-blue-100 px-1 rounded">demo</code>
          </span>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleConnectSupabase}
          className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <Settings className="w-3 h-3 mr-1" />
          Setup Supabase
        </Button>
      </AlertDescription>
    </Alert>
  );
}
