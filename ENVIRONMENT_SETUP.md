# Environment Setup Guide

## ⚠️ Security Warning

**NEVER commit your actual environment variables to version control!**
- Keep your `.env` file in `.gitignore`
- Use `.env.example` as a template
- Rotate keys regularly

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values in `.env`:**
   ```bash
   # Replace the placeholder values with your actual Supabase credentials
   VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   VITE_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   # ... etc
   ```

## Environment Variables Reference

### Frontend Variables (VITE_*)
These are exposed to the browser and should be safe for public use:

- `VITE_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `VITE_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key for client-side operations

### Backend Variables (Server-side only)
These should NEVER be exposed to the frontend:

- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations
- `SUPABASE_JWT_SECRET` - JWT secret for token verification
- `POSTGRES_*` - Database connection strings

## Security Best Practices

### 1. Key Rotation
- Rotate your Supabase keys regularly
- Use different keys for development and production
- Monitor key usage in Supabase dashboard

### 2. Environment Separation
```bash
# Development
.env.development

# Production
.env.production

# Local development
.env.local
```

### 3. Access Control
- Use Row Level Security (RLS) in Supabase
- Implement proper authentication
- Use service role key only for admin operations

### 4. Monitoring
- Enable Supabase logging
- Monitor API usage
- Set up alerts for unusual activity

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check if the key is correct
   - Ensure the key hasn't expired
   - Verify the project URL

2. **"Permission denied" error**
   - Check RLS policies
   - Verify user authentication
   - Ensure proper role assignment

3. **"Connection failed" error**
   - Check network connectivity
   - Verify database URL format
   - Ensure SSL mode is correct

### Verification Steps

1. **Test Supabase connection:**
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     process.env.VITE_PUBLIC_SUPABASE_URL,
     process.env.VITE_PUBLIC_SUPABASE_ANON_KEY
   )
   
   // Test connection
   const { data, error } = await supabase.from('your_table').select('*').limit(1)
   console.log('Connection test:', error ? 'Failed' : 'Success')
   ```

2. **Check environment loading:**
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_PUBLIC_SUPABASE_URL)
   console.log('Environment:', import.meta.env.MODE)
   ```

## Production Deployment

### Vercel
```bash
# Add environment variables in Vercel dashboard
# Or use vercel CLI:
vercel env add VITE_PUBLIC_SUPABASE_URL
vercel env add VITE_PUBLIC_SUPABASE_ANON_KEY
```

### Netlify
```bash
# Add in Netlify dashboard under Site settings > Environment variables
```

### Docker
```dockerfile
# Use build args or environment files
COPY .env.production .env
```

## Emergency Procedures

If credentials are compromised:

1. **Immediate actions:**
   - Rotate all keys in Supabase dashboard
   - Update environment variables
   - Check for unauthorized access

2. **Investigation:**
   - Review access logs
   - Check for data breaches
   - Update security policies

3. **Recovery:**
   - Deploy updated credentials
   - Monitor for suspicious activity
   - Update documentation

## Support

For issues with:
- **Supabase setup**: Check [Supabase documentation](https://supabase.com/docs)
- **Environment configuration**: Review this guide
- **Security concerns**: Contact your system administrator
