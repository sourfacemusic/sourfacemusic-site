import { createClient } from "npm:@wix/sdk";
import { productsV3 } from "npm:@wix/stores";

const PRODUCTS = [
  // Anime Room
  { name: "Demon Slayer Figure", description: "Premium Demon Slayer collectible figure. Anime Zone.", price: 29.99, category: "Anime" },
  { name: "One Piece Manga Box Set", description: "Complete One Piece Manga Box collection. Anime Zone.", price: 49.99, category: "Anime" },
  { name: "Naruto Plush", description: "Soft Naruto plush collectible. Anime Zone.", price: 19.99, category: "Anime" },
  // Gaming Room
  { name: "RGB Gaming Headset", description: "High-performance RGB Gaming Headset. Gaming Den.", price: 34.99, category: "Gaming" },
  { name: "Retro Controller", description: "Classic retro gaming controller. Gaming Den.", price: 19.99, category: "Gaming" },
  { name: "RGB Gaming Mouse", description: "Precision RGB Gaming Mouse. Gaming Den.", price: 27.99, category: "Gaming" },
  // Tech Room
  { name: "LED Bluetooth Speaker", description: "Portable LED Bluetooth Speaker. Tech & Gadgets.", price: 24.99, category: "Tech" },
  { name: "Smart Watch Pro", description: "Feature-packed Smart Watch Pro. Tech & Gadgets.", price: 39.99, category: "Tech" },
  { name: "USB Mic Pro", description: "Studio-quality USB Microphone. Tech & Gadgets.", price: 44.99, category: "Tech" },
  // Fashion Room
  { name: "Anime Hoodie", description: "Premium streetwear Anime Hoodie. Streetwear.", price: 44.99, category: "Fashion" },
  { name: "Sour Snapback", description: "Sour-Got-It Snapback Cap. Streetwear.", price: 22.99, category: "Fashion" },
  { name: "Anime Kicks", description: "Limited edition Anime Kicks. Streetwear.", price: 64.99, category: "Fashion" },
  // Collectibles Room
  { name: "Vinyl Art Figure", description: "Rare limited Vinyl Art Figure. Collectibles.", price: 59.99, category: "Collectibles" },
  { name: "Trading Card Pack", description: "Rare Trading Card Pack. Collectibles.", price: 14.99, category: "Collectibles" },
  { name: "Blind Box Figure", description: "Mystery Blind Box collectible. Collectibles.", price: 24.99, category: "Collectibles" },
  // Accessories Room
  { name: "Ice Chain", description: "Premium iced-out chain. Accessories.", price: 18.99, category: "Accessories" },
  { name: "Anime Shades", description: "Stylish anime-inspired sunglasses. Accessories.", price: 15.99, category: "Accessories" },
  { name: "Sour Ring Set", description: "Exclusive Sour Ring Set. Accessories.", price: 21.99, category: "Accessories" },
  // Home & Decor Room
  { name: "Anime LED Poster", description: "Illuminated Anime LED Poster. Home & Decor.", price: 27.99, category: "Home & Decor" },
  { name: "Neon Sign", description: "Custom Neon Sign. Home & Decor.", price: 32.99, category: "Home & Decor" },
  { name: "Anime Candle Set", description: "Scented Anime Candle Set. Home & Decor.", price: 16.99, category: "Home & Decor" },
  // Snacks Room
  { name: "Mystery Snack Box", description: "Japanese mystery snack box. Snacks.", price: 19.99, category: "Snacks" },
  { name: "Ramune 6-Pack", description: "Authentic Japanese Ramune soda 6-pack. Snacks.", price: 12.99, category: "Snacks" },
  { name: "Onigiri Snack Kit", description: "Japanese Onigiri Snack Kit. Snacks.", price: 15.99, category: "Snacks" },
  // New Drops Room
  { name: "Mystery Box", description: "SOUR-GOT-IT Mystery Box — you won't know until it arrives! New Drops.", price: 34.99, category: "New Drops" },
  { name: "Sour Bundle Deal", description: "Exclusive Sour Bundle Deal. New Drops.", price: 54.99, category: "New Drops" },
  { name: "Gift Card $25", description: "SOUR-GOT-IT Gift Card — $25 value. New Drops.", price: 25.00, category: "New Drops" },
];

export async function addSourGotItProducts(req: Request): Promise<Response> {
  const accessToken = req.headers.get("x-access-token");
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Missing access token" }), { status: 401 });
  }

  const wixClient = createClient({
    modules: { productsV3 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const results = [];
  const errors = [];

  for (const p of PRODUCTS) {
    try {
      const product = await wixClient.productsV3.createProduct({
        name: p.name,
        description: p.description,
        productType: "physical",
        priceData: {
          price: p.price,
          currency: "USD",
        },
      });
      results.push({ name: p.name, id: product.product?._id, status: "created" });
    } catch (e: any) {
      errors.push({ name: p.name, error: e.message });
    }
  }

  return new Response(JSON.stringify({ created: results.length, errors, results }), {
    headers: { "Content-Type": "application/json" },
  });
}
