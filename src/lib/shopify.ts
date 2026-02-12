const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

export function isShopifyConfigured(): boolean {
  return Boolean(domain && storefrontAccessToken);
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

async function shopifyFetch<T>(query: string, variables = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>(`
    {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `);

  return data.products.edges.map((e) => e.node);
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>(`
    {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `);

  return data.collections.edges.map((e) => e.node);
}

export async function getProductsByCollection(
  handle: string
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    collection: { products: { edges: { node: ShopifyProduct }[] } };
  }>(
    `
    query GetCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `,
    { handle }
  );

  return data.collection.products.edges.map((e) => e.node);
}

export async function createCheckout(
  lineItems: { variantId: string; quantity: number }[]
): Promise<{ checkoutId: string; webUrl: string }> {
  const data = await shopifyFetch<{
    checkoutCreate: {
      checkout: { id: string; webUrl: string };
      checkoutUserErrors: { message: string }[];
    };
  }>(
    `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `,
    {
      input: {
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    }
  );

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
  }

  return {
    checkoutId: data.checkoutCreate.checkout.id,
    webUrl: data.checkoutCreate.checkout.webUrl,
  };
}

export function formatShopifyPrice(price: ShopifyPrice): string {
  return `$${parseFloat(price.amount).toFixed(2)}`;
}
