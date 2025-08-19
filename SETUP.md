# 🚀 Dernek Panel Setup Guide

## ⚠️ Authentication Error Fix

The authentication errors you're experiencing are due to missing Supabase configuration. This app requires a Supabase project to handle authentication and data storage.

## Quick Setup

### Option 1: Connect to Supabase (Recommended)

1. **Connect to Supabase**: [Connect to Supabase](#open-mcp-popover)
   - This will help you set up your Supabase project and get the required credentials

2. **Update Environment Variables**: After connecting, you'll get:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Option 2: Manual Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Update .env file**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Set up Database Tables**: Run the migration to create required tables
   ```bash
   npm run db:setup
   ```

## Current Issues Detected

✅ **API Server**: Running on port 3002  
❌ **Supabase**: Not configured (using placeholder values)  
❌ **Authentication**: Failing due to invalid Supabase credentials  

## Development Mode

If you want to develop without Supabase temporarily, you can enable mock mode:

1. Update `.env`:
   ```env
   VITE_MOCK_API=true
   ```

2. Restart the development server

## Next Steps

1. [Connect to Supabase](#open-mcp-popover) to automatically configure your environment
2. Or manually set up Supabase credentials as described above
3. Restart the development server after configuration

For any issues, check the console for detailed error messages.
