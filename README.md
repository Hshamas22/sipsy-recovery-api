markdown
# Sipsy Cart Recovery API

Dynamic discount code assignment for abandoned cart recovery emails.

## Quick Deploy to Railway (5 minutes)

1. Go to **railway.app**
2. Sign up with GitHub (free account)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose this repo (sipsy-recovery-api)
6. Click "Deploy"
7. Wait 2-3 minutes for deployment

## Test the API

After deployment, Railway gives you a URL. Test it:


https://YOUR_RAILWAY_URL/api/stats


Should return:
json
{
  "email2": { "total": 51, "available": 51 },
  "email3": { "total": 12, "available": 12 }
}


## API Endpoints

### Assign Code

GET /api/assign-code?email=customer@example.com&type=email2


### Get Stats

GET /api/stats


## Next Steps

1. Deploy to Railway (above)
2. Copy your Railway URL
3. Update recovery-page-final.html with your URL
4. Upload to Shopify
5. Activate workflow

Done! 🚀
