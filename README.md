# Tucson Chocolate Factory — Online Ordering App

Order handcrafted chocolates for in-store pickup. Built with Next.js, connected to your Shopify store.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Shopify:**
   - Copy `.env.example` to `.env.local`
   - In your Shopify Admin, go to **Settings > Apps and sales channels > Develop apps**
   - Create an app and enable the **Storefront API** with these scopes:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_checkouts`
     - `unauthenticated_write_checkouts`
   - Copy the **Storefront API access token** and your store domain into `.env.local`

3. **Run locally:**
   ```bash
   npm run dev
   ```

## iPhone / Mobile App

This is a Progressive Web App (PWA). Customers can install it on their iPhone:

1. Open the site in Safari
2. Tap the Share button
3. Tap **Add to Home Screen**

It will appear as a standalone app with the TCF icon.

## How It Works

- Products are pulled live from your Shopify store
- Categories are auto-generated from your Shopify product types
- Checkout redirects to Shopify's secure checkout (handles payment, tax, etc.)
- Product data refreshes every 60 seconds

## Project Structure

```
src/
  app/           # Next.js pages (menu, cart, checkout, confirmation)
  components/    # UI components (Header, Footer, ProductCard, MenuContent)
  context/       # Cart state management
  lib/
    shopify.ts   # Shopify Storefront API client
    orders.ts    # Shared types and helpers
    products.ts  # Fallback product data
```
