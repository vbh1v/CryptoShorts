# Syncing Multiple Deployments

## Current Setup
- **Vaibhav's deployment**: https://cryptoshorts.vercel.app
- **Sudesh's deployment**: [His Vercel URL]

## Recommended Approach: GitHub Integration

### For Sudesh:
1. Go to his Vercel dashboard
2. Import project from Git
3. Select: https://github.com/vbh1v/CryptoShorts
4. Enable automatic deployments

### Result:
- Push to GitHub → Both deployments update automatically
- No manual coordination needed
- Each keeps their own URL

## Getting Sudesh's Details

Ask Sudesh to run this in his Claude Code:
```bash
# Get his Vercel project details
curl https://api.vercel.com/v9/projects \
  -H "Authorization: Bearer [HIS_TOKEN]" | grep name

# Get his deployment URL
echo "Check Vercel dashboard for production URL"
```

## Quick Commands

### You push code:
```bash
cd CryptoShorts
git add .
git commit -m "Update from Vaibhav"
git push origin master
# Both Vercels auto-deploy if connected to GitHub
```

### Sudesh pushes code:
Same process - GitHub is the single source of truth

## Alternative: Shared Project

Instead of separate deployments, share one:
1. Use one Vercel project
2. Add both as team members
3. Single URL for everyone
4. Simpler management