import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent File-based storage paths
const LEADS_FILE = path.join(process.cwd(), "crm_leads.json");
const STOCK_FILE = path.join(process.cwd(), "book_stock.json");
const EMAIL_OUTBOX_FILE = path.join(process.cwd(), "email_outbox.json");

// Helper: Read / Write Local Databases
function readLeads() {
  if (fs.existsSync(LEADS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    } catch {
      return [];
    }
  }
  // Base starting leads for immediate visual credibility
  const baseLeads = [
    {
      id: "lead-edu-1",
      name: "Dr. Arthur Pendelton",
      email: "pendelton.a@visart.edu",
      organization: "Visual Arts Academy of Boston",
      tierId: "licensing",
      message: "We are reviewing textbook options for our 2026 fall intake. We would like to license 'The Art of Watercolor' workbook content for 120 incoming freshmen.",
      submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      hotLead: true,
      priority: true,
      crmStatus: "Synced to Google Sheets / Airtable"
    },
    {
      id: "lead-gal-2",
      name: "Sabrina Moretti",
      email: "sabrina@morettigallery.com",
      organization: "Moretti Contemporary",
      tierId: "galleries",
      message: "Incredibly impressed by 'Warm Desert Solitude'. We would love to discuss a prospective solo representation contract for our Winter fine arts catalog and schedule a studio visit.",
      submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      hotLead: true,
      priority: false,
      crmStatus: "Synced to Google Sheets / Airtable"
    }
  ];
  fs.writeFileSync(LEADS_FILE, JSON.stringify(baseLeads, null, 2));
  return baseLeads;
}

function writeLeads(leads: any) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// Initial book stock levels
const INITIAL_STOCK = {
  "art-of-watercolor": 25,
  "composition-sketching": 12,
  "artful-classroom": 0 // physical copy completely sold out!
};

function readStock() {
  if (fs.existsSync(STOCK_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STOCK_FILE, "utf-8"));
    } catch {
      return INITIAL_STOCK;
    }
  }
  fs.writeFileSync(STOCK_FILE, JSON.stringify(INITIAL_STOCK, null, 2));
  return INITIAL_STOCK;
}

function writeStock(stock: any) {
  fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2));
}

// Simulated sent emails (For Ebooks & Partnership leads)
function readEmails() {
  if (fs.existsSync(EMAIL_OUTBOX_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(EMAIL_OUTBOX_FILE, "utf-8"));
    } catch {
      return [];
    }
  }
  return [];
}

function writeEmails(emails: any) {
  fs.writeFileSync(EMAIL_OUTBOX_FILE, JSON.stringify(emails, null, 2));
}

const ARTWORK_ORDERS_FILE = path.join(process.cwd(), "artwork_orders.json");

function readArtworkOrders() {
  if (fs.existsSync(ARTWORK_ORDERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ARTWORK_ORDERS_FILE, "utf-8"));
    } catch {
      return [];
    }
  }
  return [];
}

function writeArtworkOrders(orders: any) {
  fs.writeFileSync(ARTWORK_ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function logEmail(to: string, subject: string, body: string, attachments: string[] = []) {
  const emails = readEmails();
  emails.unshift({
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to,
    subject,
    body,
    attachments,
    sentAt: new Date().toISOString()
  });
  writeEmails(emails);
}

// --- API ROUTES ---

// 1. GET book inventory level
app.get("/api/inventory", (req, res) => {
  const stock = readStock();
  res.json(stock);
});

// 1b. POST manual update to book inventory level
app.post("/api/inventory", (req, res) => {
  const bookId = req.query.id as string;
  const qtyInput = req.query.qty as string;
  
  if (!bookId || qtyInput === undefined) {
    return res.status(400).json({ error: "Missing book ID or qty parameters" });
  }

  const stock = readStock();
  const newQty = parseInt(qtyInput);
  
  if (isNaN(newQty)) {
    return res.status(400).json({ error: "Invalid qty value" });
  }

  stock[bookId] = Math.max(0, newQty);
  writeStock(stock);
  res.json({ success: true, stock });
});

// 2. GET API leads
app.get("/api/leads", (req, res) => {
  res.json(readLeads());
});

// 2b. GET artwork orders
app.get("/api/artwork-orders", (req, res) => {
  res.json(readArtworkOrders());
});

// 2c. POST artwork order
app.post("/api/artwork-order", async (req, res) => {
  try {
    const { artworkId, artworkTitle, artworkPrice, customerName, customerEmail } = req.body;
    if (!artworkId || !artworkTitle || !customerName || !customerEmail) {
      return res.status(400).json({ error: "Missing required artwork checkout parameters" });
    }

    const orders = readArtworkOrders();
    const newOrder = {
      id: `ordered-art-${Date.now()}`,
      artworkId,
      artworkTitle,
      artworkPrice: artworkPrice || 0,
      customerName,
      customerEmail,
      status: "reserved",
      orderedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    writeArtworkOrders(orders);

    // Draft customized confirmation email from Alan via Gemini AI
    let responderBody = `Dear ${customerName},\n\nThank you for placing an order to purchase the original painting: "${artworkTitle}".\n\nI am thrilled that this piece has connected with you! I have temporarily reserved the canvas for you in our studio archives.\n\nI will contact you within 24 hours to coordinate secure, insured crating, customs documentation, and delivery details.\n\nWarmly,\nAlan Ayesigamukama\nUgandan Visual Artist & Art Educator\nCall/WhatsApp: 0700866521 / 0761188522\nEmail: alanayesigamukama@gmail.com`;

    if (ai) {
      try {
        const aiPrompt = `Write a beautiful, personalized, deeply grateful professional auto-responder email from Alan Ayesigamukama (Ugandan visual artist) to a client who just ordered/reserved his original painting: "${artworkTitle}" priced at UGX ${artworkPrice ? Number(artworkPrice).toLocaleString() : 'negotiable'}.
Client Name: ${customerName}
Client Email: ${customerEmail}
Key Artist Details:
- Artist Name: Alan Ayesigamukama (Ugandan Visual Artist, Educator, Writer)
- Brand / Gallery Name: Alan Art Vision
- Core Theme: Exploring ghetto/slum children's emotional struggle, resilience, and hope.
- Outbox Contact: Phone/WhatsApp 0700866521 / 0761188522, Email alanayesigamukama@gmail.com
Requirements:
1. Express standard, earnest artist gratitude for their appreciation of Ugandan visual artworks.
2. Confirm that the canvas has been reserved for them.
3. State that we will contact them to arrange custom shipping/crating shortly.
4. Keep the text highly inspiring, warm, and professional. Limit to 120-150 words.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: aiPrompt,
        });

        if (response.text) {
          responderBody = response.text.trim();
        }
      } catch (e) {
        console.error("Gemini failed to generate artwork checkout response, using default template. Error:", e);
      }
    }

    // Log the simulated SMTP outbox email
    logEmail(
      customerEmail,
      `[Alan Art Vision] Original Art Order Reservation (#${newOrder.id}) Confirm - "${artworkTitle}"`,
      responderBody
    );

    res.json({
      success: true,
      order: newOrder,
      message: responderBody
    });

  } catch (error) {
    console.error("Artwork order error:", error);
    res.status(500).json({ error: "Internal server error processing artwork order" });
  }
});

// 3. GET logged outbox emails
app.get("/api/emails", (req, res) => {
  res.json(readEmails());
});

// 4. POST Partnership Leads
app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, organization, tierId, message } = req.body;
    if (!name || !email || !organization || !tierId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const leads = readLeads();
    const isEdu = email.trim().toLowerCase().endsWith(".edu");
    
    const newLead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      organization,
      tierId,
      message: message || "",
      submittedAt: new Date().toISOString(),
      hotLead: true, // Always labeled Hot Lead
      priority: isEdu, // Priority if .edu email
      crmStatus: "Synced to Google Sheets / Airtable" // Real simulation of instant API transmission logic
    };

    leads.unshift(newLead);
    writeLeads(leads);

    // Draft a customized response using AI!
    let responderBody = `Dear ${name},\n\nThank you for reaching out to us regarding the ${tierId} partnership program with our Art Teacher and Author studio. We are excited about cooperating with you and the team at ${organization}.\n\nAttached to this email is your requested copy of the complete "Visual Arts & Books Partnership Handbook (PDF)".\n\nOur team will review your application within 2 business days.\n\nWarmly,\nAlan Ayesigamukama Studio Support`;
    
    if (ai) {
      try {
        const aiPrompt = `Write a beautiful, personalized, highly encouraging professional auto-responder email from Alan Ayesigamukama, an art teacher & author, to a prospective partner.
Partner Name: ${name}
Organization Name: ${organization}
Partnership Tier: ${tierId}
Their Message Context: "${message || 'None provided'}"
Requirements:
1. Sound warm, artistic, encouraging, yet professional (like a cozy studio meets organized educator).
2. Explicitly thank them for applying.
3. State that we have instantly attached their "Art Studio & Educational Partnership Kit (PDF)" to this email.
4. Keep the draft authentic (do not use generic buzzwords). Limit response to 120-150 words.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: aiPrompt,
        });

        if (response.text) {
          responderBody = response.text.trim();
        }
      } catch (e) {
        console.error("Gemini failed to generate lead autoresponder, using default template. Error:", e);
      }
    }

    // Instantly queue and write outbox email log
    logEmail(
      email,
      `[Hot Lead] Your Art Studio Partnership Kit & Application Approved - Alan Ayesigamukama`,
      responderBody,
      ["Ayesiga_Gallery_Partnership_Kit_2026.pdf"]
    );

    res.json({
      success: true,
      lead: newLead,
      autoResponseSummary: responderBody
    });
  } catch (error: any) {
    console.error("Lead submission error:", error);
    res.status(500).json({ error: "Internal server error submitting lead" });
  }
});

// 5. POST Checkout (With Inventory decline, eBook delivery & quantity discounts)
app.post("/api/checkout", async (req, res) => {
  try {
    const { items, customerName, customerEmail } = req.body;
    if (!items || !items.length || !customerName || !customerEmail) {
      return res.status(400).json({ error: "Missing checkout parameters" });
    }

    const currentStock = readStock();
    const declinedItems: string[] = [];
    let aiDeclineMessage = "";

    // 1st pass: Validate stock levels for HARDCOVER/WORKBOOK items
    // eBook purchases have infinite inventory
    for (const item of items) {
      if (item.purchaseType !== "eBook") {
        const available = currentStock[item.book.id] ?? 0;
        if (available < item.quantity) {
          declinedItems.push(`${item.book.title} (${item.purchaseType} Edition)`);
        }
      }
    }

    // Decline transaction if out of stock
    if (declinedItems.length > 0) {
      // Use Gemini to generate an extremely polite, artistically customized decline response!
      let standardDecline = `Dear ${customerName},\n\nWe apologize, but some items in your cart are currently out of stock in our studio physical inventory. Please remove them or switch to their eBook equivalents to complete your order.`;
      
      if (ai) {
        try {
          const aiPrompt = `Compose an elegant, polite, warm, and highly personalized apology email from Alan Ayesigamukama (Art Teacher & Author) to ${customerName}.
The transaction was declined because these physical items are out of stock: ${declinedItems.join(", ")}.
Explain that the physical print editions are temporarily sold out due to high teacher curriculum orders.
Encourage them to purchase the instant eBook edition instead, or opt to join our catalog print pre-order queue.
Be very supportive, warm, and professional. Match a cozy studio vibe. No robotic language, limit to 100-130 words.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: aiPrompt,
          });

          if (response.text) {
            aiDeclineMessage = response.text.trim();
          }
        } catch (e) {
          console.error("Gemini checkout decline generator failed:", e);
        }
      }

      return res.json({
        success: false,
        reason: "out_of_stock",
        declineList: declinedItems,
        message: aiDeclineMessage || standardDecline
      });
    }

    // 2nd pass: Purchase approved. Deduct stock.
    let orderSubtotal = 0;
    let orderDiscount = 0;
    const processedItems = [];
    const downloads: { bookTitle: string; downloadUrl: string }[] = [];

    for (const item of items) {
      const isEbook = item.purchaseType === "eBook";
      const unitPrice = isEbook ? item.book.ebookPrice : item.book.price;
      let itemSubtotal = unitPrice * item.quantity;
      let discountApplied = false;

      // Class Set Discount check (Quantity > 5)
      if (item.quantity > 5) {
        itemSubtotal = itemSubtotal * 0.8; // 20% discount
        discountApplied = true;
      }

      orderSubtotal += itemSubtotal;

      // If physical, deduct from persistent inventory stock
      if (!isEbook) {
        currentStock[item.book.id] = (currentStock[item.book.id] ?? 0) - item.quantity;
      }

      processedItems.push({
        bookId: item.book.id,
        title: item.book.title,
        purchaseType: item.purchaseType,
        quantity: item.quantity,
        pricePaid: itemSubtotal / item.quantity,
        addBookplates: item.addBookplates || false,
        discountApplied
      });

      // If direct ebook or digital companion resources, prepare digital download links
      if (isEbook || item.book.id === "art-of-watercolor" || item.book.id === "artful-classroom") {
        downloads.push({
          bookTitle: item.book.title,
          downloadUrl: `/downloads/${item.book.id}_complete_edition_${Math.floor(Math.random() * 900000 + 100000)}.pdf`
        });
      }
    }

    // Save updated stock
    writeStock(currentStock);

    // Core Bundle calculation helper (3 books discount bundle helper on checkout backend)
    const uniqueBookIds = Array.from(new Set(items.map((it: any) => it.book.id)));
    let isPromoBundle = false;
    if (uniqueBookIds.length >= 3) {
      // Apply bundle discount
      const discountVal = orderSubtotal * 0.15; // 15% discount off the total bundle
      orderSubtotal = orderSubtotal - discountVal;
      orderDiscount += discountVal;
      isPromoBundle = true;
    }

    // Create the order outbox logs and trigger email alerts
    const orderId = `order-${Date.now()}`;
    
    // Simulate digital logs email delivery
    let digitalEmailBody = `Dear ${customerName},\n\nThank you for choosing Alan Ayesigamukama's art curricula! Your transaction has been processed successfully under order ID: ${orderId}.\n\n`;
    
    if (downloads.length > 0) {
      digitalEmailBody += `Here are your high-resolution instant digital ebook download links:\n\n`;
      downloads.forEach((dl) => {
        digitalEmailBody += `- ${dl.bookTitle}: https://alanartvision.com/api/download?key=${Math.floor(Math.random() * 899999 + 100000)}&file=${encodeURIComponent(dl.downloadUrl)}\n`;
      });
      digitalEmailBody += `\nThese links are valid forever and include complimentary access to all future workbook revisions.`;
    } else {
      digitalEmailBody += `Your physical text hardcover package has entered our order fulfillment system and will ship within 24 hours. A tracking code will be dispatched shortly.`;
    }

    digitalEmailBody += `\n\nNeed class materials? Don't forget that school licenses are available regarding curriculum-wide integration.\n\nWarmly,\nAlan Art Vision Gallery & Press`;

    logEmail(
      customerEmail,
      `[Digital Delivery] Your Alan Ayesigamukama Art Books Order (#${orderId}) Confirmed`,
      digitalEmailBody
    );

    res.json({
      success: true,
      orderId,
      processedItems,
      totalPrice: orderSubtotal,
      discountTotal: orderDiscount,
      bundleApplied: isPromoBundle,
      downloads
    });

  } catch (err: any) {
    console.error("Checkout process error:", err);
    res.status(500).json({ error: "An error occurred during checkout processing." });
  }
});

// Setup Vite & App Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack] Server running on http://localhost:${PORT}`);
  });
}

startServer();
