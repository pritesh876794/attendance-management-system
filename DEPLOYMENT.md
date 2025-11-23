# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase project set up

### Step-by-Step Deployment

#### 1. Push to GitHub
Your code is already on GitHub at:
```
https://github.com/pritesh876794/attendance-management-system
```

#### 2. Import to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import `pritesh876794/attendance-management-system`
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview, Development |

#### 4. Deploy
Click "Deploy" and wait ~2 minutes

Your app will be live at:
```
https://attendance-management-system-[random].vercel.app
```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain (e.g., `attendance.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

---

## Alternative: Netlify Deployment

### 1. Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. Deploy
1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Add environment variables
4. Deploy

---

## Alternative: Railway Deployment

### 1. Create `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Deploy
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

---

## Alternative: Docker Deployment

### 1. Create `Dockerfile`
```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### 2. Build & Run
```bash
docker build -t attendance-system .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  attendance-system
```

---

## Post-Deployment Checklist

- [ ] Test login functionality
- [ ] Verify check-in/check-out works
- [ ] Test admin dashboard
- [ ] Check mobile responsiveness
- [ ] Verify database connections
- [ ] Test all user flows
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure custom domain (optional)
- [ ] Set up error tracking (Sentry)
- [ ] Enable HTTPS (automatic on Vercel)

---

## Monitoring & Analytics

### Vercel Analytics
1. Go to Project → Analytics
2. Enable Web Analytics
3. View real-time metrics

### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Performance Monitoring
- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Track API response times

---

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies installed
- Check environment variables

### Runtime Errors
- Check Supabase connection
- Verify RLS policies
- Check browser console

### Slow Performance
- Enable caching
- Optimize images
- Use CDN for static assets

---

## Scaling Considerations

### Database
- Supabase Pro for production
- Enable connection pooling
- Add database indexes

### Frontend
- Enable Vercel Edge Network
- Use ISR for static pages
- Implement caching strategies

### Security
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention (handled by Supabase)

---

## Backup Strategy

### Database Backups
1. Supabase automatic backups (Pro plan)
2. Manual exports via SQL Editor
3. Scheduled backup scripts

### Code Backups
- GitHub repository (primary)
- Local clones
- Vercel deployment history

---

## Support

- **Deployment Issues**: Check Vercel logs
- **Database Issues**: Check Supabase logs
- **General Help**: Open GitHub issue

---

**Your app is now live! 🚀**
