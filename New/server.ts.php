import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";
import axios from "axios";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const PORT = 3000;

  app.use(express.json());

  // Amadeus Token Management
  let amadeusToken = "";
  let tokenExpiry = 0;

  async function getAmadeusToken() {
    if (amadeusToken && Date.now() < tokenExpiry) return amadeusToken;

    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn("Amadeus credentials missing. Using mock mode.");
      return null;
    }

    try {
      const response = await axios.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      amadeusToken = response.data.access_token;
      tokenExpiry = Date.now() + response.data.expires_in * 1000;
      return amadeusToken;
    } catch (error) {
      console.error("Error fetching Amadeus token:", error);
      return null;
    }
  }

  // API Routes
  app.get("/api/airports", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.json([]);

    const token = await getAmadeusToken();
    if (!token) {
      // Expanded Mock data for better demo experience
      const mockLocations = [
        // Middle East
        { iataCode: "DXB", name: "Dubai International Airport", address: { cityName: "Dubai United Arab Emirates" }, subType: "AIRPORT" },
        { iataCode: "AAN", name: "Al Ain International Airport", address: { cityName: "Al Ain United Arab Emirates" }, subType: "AIRPORT" },
        { iataCode: "RKT", name: "Ras Al Khaimah International Airport", address: { cityName: "Ras Al Khaimah United Arab Emirates" }, subType: "AIRPORT" },
        { iataCode: "DWC", name: "Al Maktoum International Airport", address: { cityName: "Dubai United Arab Emirates" }, subType: "AIRPORT" },
        { iataCode: "SHJ", name: "Sharjah International Airport", address: { cityName: "Sharjah United Arab Emirates" }, subType: "AIRPORT" },
        { iataCode: "AUH", name: "Abu Dhabi International Airport", address: { cityName: "Abu Dhabi United Arab Emirates" }, subType: "AIRPORT" },
        { iataCode: "DOH", name: "Hamad International Airport", address: { cityName: "Doha Qatar" }, subType: "AIRPORT" },
        { iataCode: "DIA", name: "Doha International Airport", address: { cityName: "Doha Qatar" }, subType: "AIRPORT" },
        { iataCode: "RUH", name: "King Khalid International", address: { cityName: "Riyadh Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "JED", name: "King Abdulaziz International", address: { cityName: "Jeddah Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "MCT", name: "Muscat International Airport", address: { cityName: "Muscat Oman" }, subType: "AIRPORT" },
        { iataCode: "SLL", name: "Salalah International Airport", address: { cityName: "Salalah Oman" }, subType: "AIRPORT" },
        { iataCode: "KWI", name: "Kuwait International", address: { cityName: "Kuwait City Kuwait" }, subType: "AIRPORT" },
        { iataCode: "BAH", name: "Bahrain International", address: { cityName: "Manama Bahrain" }, subType: "AIRPORT" },
        { iataCode: "DMM", name: "King Fahd International", address: { cityName: "Dammam Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "RSI", name: "Red Sea International", address: { cityName: "Hanak Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "ULH", name: "Prince Abdul Majeed bin Abdulaziz", address: { cityName: "Al Ula Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "HAS", name: "Hail International", address: { cityName: "Hail Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "MED", name: "Prince Mohammad bin Abdulaziz International Airport", address: { cityName: "Medina Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "NUM", name: "Neom Bay Airport", address: { cityName: "Tabuk Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "TIF", name: "Taif International Airport", address: { cityName: "Taif Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "YNB", name: "Prince Abdul Mohsin Bin Abdulaziz International Airport", address: { cityName: "Yanbu Saudi Arabia" }, subType: "AIRPORT" },
        { iataCode: "TUU", name: "Prince Sultan bin Abdulaziz Airport", address: { cityName: "Tabuk Saudi Arabia" }, subType: "AIRPORT" },

        // Pakistan
        { iataCode: "KHI", name: "Jinnah International", address: { cityName: "Karachi" }, subType: "AIRPORT" },
        { iataCode: "LHE", name: "Allama Iqbal International", address: { cityName: "Lahore" }, subType: "AIRPORT" },
        { iataCode: "ISB", name: "Islamabad International", address: { cityName: "Islamabad" }, subType: "AIRPORT" },
        { iataCode: "PEW", name: "Bacha Khan International", address: { cityName: "Peshawar" }, subType: "AIRPORT" },
        { iataCode: "MUX", name: "Multan International", address: { cityName: "Multan" }, subType: "AIRPORT" },
        { iataCode: "SKZ", name: "Sukkur Airport", address: { cityName: "Sukkur" }, subType: "AIRPORT" },
        { iataCode: "LYP", name: "Faisalabad International", address: { cityName: "Faisalabad" }, subType: "AIRPORT" },
        { iataCode: "UET", name: "Quetta International", address: { cityName: "Quetta" }, subType: "AIRPORT" },
        { iataCode: "SKT", name: "Sialkot International", address: { cityName: "Sialkot" }, subType: "AIRPORT" },

        // Europe
        { iataCode: "LHR", name: "London Heathrow", address: { cityName: "London" }, subType: "AIRPORT" },
        { iataCode: "LGW", name: "London Gatwick", address: { cityName: "London" }, subType: "AIRPORT" },
        { iataCode: "STN", name: "London Stansted", address: { cityName: "London" }, subType: "AIRPORT" },
        { iataCode: "CDG", name: "Charles de Gaulle", address: { cityName: "Paris" }, subType: "AIRPORT" },
        { iataCode: "ORY", name: "Paris Orly", address: { cityName: "Paris" }, subType: "AIRPORT" },
        { iataCode: "FRA", name: "Frankfurt Airport", address: { cityName: "Frankfurt" }, subType: "AIRPORT" },
        { iataCode: "AMS", name: "Schiphol Airport", address: { cityName: "Amsterdam" }, subType: "AIRPORT" },
        { iataCode: "MAD", name: "Adolfo Suárez Madrid–Barajas", address: { cityName: "Madrid" }, subType: "AIRPORT" },
        { iataCode: "BCN", name: "Josep Tarradellas Barcelona–El Prat", address: { cityName: "Barcelona" }, subType: "AIRPORT" },
        { iataCode: "IST", name: "Istanbul Airport", address: { cityName: "Istanbul" }, subType: "AIRPORT" },
        { iataCode: "SAW", name: "Sabiha Gökçen International", address: { cityName: "Istanbul" }, subType: "AIRPORT" },
        { iataCode: "FCO", name: "Leonardo da Vinci–Fiumicino", address: { cityName: "Rome" }, subType: "AIRPORT" },
        { iataCode: "MUC", name: "Munich Airport", address: { cityName: "Munich" }, subType: "AIRPORT" },
        { iataCode: "ZRH", name: "Zurich Airport", address: { cityName: "Zurich" }, subType: "AIRPORT" },
        { iataCode: "VIE", name: "Vienna International", address: { cityName: "Vienna" }, subType: "AIRPORT" },
        
        // North America
        { iataCode: "JFK", name: "John F. Kennedy Intl", address: { cityName: "New York" }, subType: "AIRPORT" },
        { iataCode: "EWR", name: "Newark Liberty Intl", address: { cityName: "New York" }, subType: "AIRPORT" },
        { iataCode: "LGA", name: "LaGuardia Airport", address: { cityName: "New York" }, subType: "AIRPORT" },
        { iataCode: "LAX", name: "Los Angeles International", address: { cityName: "Los Angeles" }, subType: "AIRPORT" },
        { iataCode: "ORD", name: "O'Hare International", address: { cityName: "Chicago" }, subType: "AIRPORT" },
        { iataCode: "DFW", name: "Dallas/Fort Worth Intl", address: { cityName: "Dallas" }, subType: "AIRPORT" },
        { iataCode: "ATL", name: "Hartsfield–Jackson Atlanta Intl", address: { cityName: "Atlanta" }, subType: "AIRPORT" },
        { iataCode: "SFO", name: "San Francisco International", address: { cityName: "San Francisco" }, subType: "AIRPORT" },
        { iataCode: "MIA", name: "Miami International", address: { cityName: "Miami" }, subType: "AIRPORT" },
        { iataCode: "YYZ", name: "Toronto Pearson International", address: { cityName: "Toronto" }, subType: "AIRPORT" },
        { iataCode: "YVR", name: "Vancouver International", address: { cityName: "Vancouver" }, subType: "AIRPORT" },
        
        // Asia & Oceania
        { iataCode: "SIN", name: "Changi Airport", address: { cityName: "Singapore" }, subType: "AIRPORT" },
        { iataCode: "HND", name: "Haneda Airport", address: { cityName: "Tokyo" }, subType: "AIRPORT" },
        { iataCode: "NRT", name: "Narita International", address: { cityName: "Tokyo" }, subType: "AIRPORT" },
        { iataCode: "HKG", name: "Hong Kong International", address: { cityName: "Hong Kong" }, subType: "AIRPORT" },
        { iataCode: "ICN", name: "Incheon International", address: { cityName: "Seoul" }, subType: "AIRPORT" },
        { iataCode: "BKK", name: "Suvarnabhumi Airport", address: { cityName: "Bangkok" }, subType: "AIRPORT" },
        { iataCode: "KUL", name: "Kuala Lumpur Intl", address: { cityName: "Kuala Lumpur" }, subType: "AIRPORT" },
        { iataCode: "PVG", name: "Shanghai Pudong International", address: { cityName: "Shanghai" }, subType: "AIRPORT" },
        { iataCode: "PEK", name: "Beijing Capital International", address: { cityName: "Beijing" }, subType: "AIRPORT" },
        { iataCode: "SYD", name: "Sydney Kingsford Smith", address: { cityName: "Sydney" }, subType: "AIRPORT" },
        { iataCode: "MEL", name: "Melbourne Airport", address: { cityName: "Melbourne" }, subType: "AIRPORT" },
        { iataCode: "BOM", name: "Chhatrapati Shivaji Maharaj Intl", address: { cityName: "Mumbai" }, subType: "AIRPORT" },
        { iataCode: "DEL", name: "Indira Gandhi Intl", address: { cityName: "Delhi" }, subType: "AIRPORT" },
        { iataCode: "BLR", name: "Kempegowda International", address: { cityName: "Bengaluru" }, subType: "AIRPORT" },
        
        // Cities
        { name: "Dubai", address: { cityName: "Dubai" }, subType: "CITY", detailedName: "DUBAI, UNITED ARAB EMIRATES" },
        { name: "Abu Dhabi", address: { cityName: "Abu Dhabi" }, subType: "CITY", detailedName: "ABU DHABI, UNITED ARAB EMIRATES" },
        { name: "Sharjah", address: { cityName: "Sharjah" }, subType: "CITY", detailedName: "SHARJAH, UNITED ARAB EMIRATES" },
        { name: "Karachi", address: { cityName: "Karachi" }, subType: "CITY", detailedName: "KARACHI, PAKISTAN" },
        { name: "Lahore", address: { cityName: "Lahore" }, subType: "CITY", detailedName: "LAHORE PAKISTAN" },
        { name: "Islamabad", address: { cityName: "Islamabad" }, subType: "CITY", detailedName: "ISLAMABAD, PAKISTAN" },
        { name: "Peshawar", address: { cityName: "Peshawar" }, subType: "CITY", detailedName: "PESHAWAR, PAKISTAN" },
        { name: "Multan", address: { cityName: "Multan" }, subType: "CITY", detailedName: "MULTAN, PAKISTAN" },
        { name: "Faisalabad", address: { cityName: "Faisalabad" }, subType: "CITY", detailedName: "FAISALABAD, PAKISTAN" },
        { name: "Quetta", address: { cityName: "Quetta" }, subType: "CITY", detailedName: "QUETTA, PAKISTAN" },
        { name: "Sialkot", address: { cityName: "Sialkot" }, subType: "CITY", detailedName: "SIALKOT, PAKISTAN" },
        { name: "London", address: { cityName: "London" }, subType: "CITY", detailedName: "LONDON, UNITED KINGDOM" },
        { name: "New York", address: { cityName: "New York" }, subType: "CITY", detailedName: "NEW YORK, USA" },
        { name: "Paris", address: { cityName: "Paris" }, subType: "CITY", detailedName: "PARIS, FRANCE" },
        { name: "Singapore", address: { cityName: "Singapore" }, subType: "CITY", detailedName: "SINGAPORE, SINGAPORE" },
        { name: "Tokyo", address: { cityName: "Tokyo" }, subType: "CITY", detailedName: "TOKYO, JAPAN" },
        { name: "Istanbul", address: { cityName: "Istanbul" }, subType: "CITY", detailedName: "ISTANBUL, TURKEY" },
        { name: "Mumbai", address: { cityName: "Mumbai" }, subType: "CITY", detailedName: "MUMBAI, INDIA" },
        { name: "Delhi", address: { cityName: "Delhi" }, subType: "CITY", detailedName: "DELHI, INDIA" },
        { name: "Bangkok", address: { cityName: "Bangkok" }, subType: "CITY", detailedName: "BANGKOK, THAILAND" },
        { name: "Hong Kong", address: { cityName: "Hong Kong" }, subType: "CITY", detailedName: "HONG KONG, CHINA" },
        { name: "Sydney", address: { cityName: "Sydney" }, subType: "CITY", detailedName: "SYDNEY, AUSTRALIA" },
        { name: "Rome", address: { cityName: "Rome" }, subType: "CITY", detailedName: "ROME, ITALY" },
        { name: "Barcelona", address: { cityName: "Barcelona" }, subType: "CITY", detailedName: "BARCELONA, SPAIN" },
        { name: "Madrid", address: { cityName: "Madrid" }, subType: "CITY", detailedName: "MADRID, SPAIN" },
        { name: "Berlin", address: { cityName: "Berlin" }, subType: "CITY", detailedName: "BERLIN, GERMANY" },
        { name: "Amsterdam", address: { cityName: "Amsterdam" }, subType: "CITY", detailedName: "AMSTERDAM, NETHERLANDS" },
        { name: "Vienna", address: { cityName: "Vienna" }, subType: "CITY", detailedName: "VIENNA, AUSTRIA" },
        { name: "Zurich", address: { cityName: "Zurich" }, subType: "CITY", detailedName: "ZURICH, SWITZERLAND" },
        { name: "Moscow", address: { cityName: "Moscow" }, subType: "CITY", detailedName: "MOSCOW, RUSSIA" },
        { name: "Cairo", address: { cityName: "Cairo" }, subType: "CITY", detailedName: "CAIRO, EGYPT" },
        { name: "Cape Town", address: { cityName: "Cape Town" }, subType: "CITY", detailedName: "CAPE TOWN, SOUTH AFRICA" },
        { name: "Rio de Janeiro", address: { cityName: "Rio de Janeiro" }, subType: "CITY", detailedName: "RIO DE JANEIRO, BRAZIL" },
        { name: "Buenos Aires", address: { cityName: "Buenos Aires" }, subType: "CITY", detailedName: "BUENOS AIRES, ARGENTINA" },
        { name: "Mexico City", address: { cityName: "Mexico City" }, subType: "CITY", detailedName: "MEXICO CITY, MEXICO" },
        { name: "Toronto", address: { cityName: "Toronto" }, subType: "CITY", detailedName: "TORONTO, CANADA" },
        { name: "Vancouver", address: { cityName: "Vancouver" }, subType: "CITY", detailedName: "VANCOUVER, CANADA" },
        { name: "Seoul", address: { cityName: "Seoul" }, subType: "CITY", detailedName: "SEOUL, SOUTH KOREA" },
        { name: "Beijing", address: { cityName: "Beijing" }, subType: "CITY", detailedName: "BEIJING, CHINA" },
        { name: "Shanghai", address: { cityName: "Shanghai" }, subType: "CITY", detailedName: "SHANGHAI, CHINA" },
        { name: "Kuala Lumpur", address: { cityName: "Kuala Lumpur" }, subType: "CITY", detailedName: "KUALA LUMPUR, MALAYSIA" },
        { name: "Manila", address: { cityName: "Manila" }, subType: "CITY", detailedName: "MANILA, PHILIPPINES" },
        { name: "Jakarta", address: { cityName: "Jakarta" }, subType: "CITY", detailedName: "JAKARTA, INDONESIA" },
        { name: "Melbourne", address: { cityName: "Melbourne" }, subType: "CITY", detailedName: "MELBOURNE, AUSTRALIA" },
        { name: "Auckland", address: { cityName: "Auckland" }, subType: "CITY", detailedName: "AUCKLAND, NEW ZEALAND" },
        { name: "Los Angeles", address: { cityName: "Los Angeles" }, subType: "CITY", detailedName: "LOS ANGELES, USA" },
        { name: "San Francisco", address: { cityName: "San Francisco" }, subType: "CITY", detailedName: "SAN FRANCISCO, USA" },
        { name: "Chicago", address: { cityName: "Chicago" }, subType: "CITY", detailedName: "CHICAGO, USA" },
        { name: "Miami", address: { cityName: "Miami" }, subType: "CITY", detailedName: "MIAMI, USA" },
        { name: "Dallas", address: { cityName: "Dallas" }, subType: "CITY", detailedName: "DALLAS, USA" },
        { name: "Atlanta", address: { cityName: "Atlanta" }, subType: "CITY", detailedName: "ATLANTA, USA" },
        { name: "Frankfurt", address: { cityName: "Frankfurt" }, subType: "CITY", detailedName: "FRANKFURT, GERMANY" },
        { name: "Munich", address: { cityName: "Munich" }, subType: "CITY", detailedName: "MUNICH, GERMANY" },
        { name: "Milan", address: { cityName: "Milan" }, subType: "CITY", detailedName: "MILAN, ITALY" },
        { name: "Lisbon", address: { cityName: "Lisbon" }, subType: "CITY", detailedName: "LISBON, PORTUGAL" },
        { name: "Athens", address: { cityName: "Athens" }, subType: "CITY", detailedName: "ATHENS, GREECE" },
        { name: "Prague", address: { cityName: "Prague" }, subType: "CITY", detailedName: "PRAGUE, CZECH REPUBLIC" },
        { name: "Warsaw", address: { cityName: "Warsaw" }, subType: "CITY", detailedName: "WARSAW, POLAND" },
        { name: "Stockholm", address: { cityName: "Stockholm" }, subType: "CITY", detailedName: "STOCKHOLM, SWEDEN" },
        { name: "Oslo", address: { cityName: "Oslo" }, subType: "CITY", detailedName: "OSLO, NORWAY" },
        { name: "Copenhagen", address: { cityName: "Copenhagen" }, subType: "CITY", detailedName: "COPENHAGEN, DENMARK" },
        { name: "Helsinki", address: { cityName: "Helsinki" }, subType: "CITY", detailedName: "HELSINKI, FINLAND" },
        { name: "Dublin", address: { cityName: "Dublin" }, subType: "CITY", detailedName: "DUBLIN, IRELAND" },
        { name: "Brussels", address: { cityName: "Brussels" }, subType: "CITY", detailedName: "BRUSSELS, BELGIUM" },
        { name: "Geneva", address: { cityName: "Geneva" }, subType: "CITY", detailedName: "GENEVA, SWITZERLAND" },
        { name: "Doha", address: { cityName: "Doha" }, subType: "CITY", detailedName: "DOHA, QATAR" },
        { name: "Riyadh", address: { cityName: "Riyadh" }, subType: "CITY", detailedName: "RIYADH, SAUDI ARABIA" },
        { name: "Jeddah", address: { cityName: "Jeddah" }, subType: "CITY", detailedName: "JEDDAH, SAUDI ARABIA" },
        { name: "Muscat", address: { cityName: "Muscat" }, subType: "CITY", detailedName: "MUSCAT, OMAN" },
        { name: "Kuwait City", address: { cityName: "Kuwait City" }, subType: "CITY", detailedName: "KUWAIT CITY, KUWAIT" },
        { name: "Manama", address: { cityName: "Manama" }, subType: "CITY", detailedName: "MANAMA, BAHRAIN" },
        { name: "Tel Aviv", address: { cityName: "Tel Aviv" }, subType: "CITY", detailedName: "TEL AVIV, ISRAEL" },
        { name: "Beirut", address: { cityName: "Beirut" }, subType: "CITY", detailedName: "BEIRUT, LEBANON" },
        { name: "Amman", address: { cityName: "Amman" }, subType: "CITY", detailedName: "AMMAN, JORDAN" },
        { name: "Casablanca", address: { cityName: "Casablanca" }, subType: "CITY", detailedName: "CASABLANCA, MOROCCO" },
        { name: "Marrakech", address: { cityName: "Marrakech" }, subType: "CITY", detailedName: "MARRAKECH, MOROCCO" },
        { name: "Nairobi", address: { cityName: "Nairobi" }, subType: "CITY", detailedName: "NAIROBI, KENYA" },
        { name: "Lagos", address: { cityName: "Lagos" }, subType: "CITY", detailedName: "LAGOS, NIGERIA" },
        { name: "Sao Paulo", address: { cityName: "Sao Paulo" }, subType: "CITY", detailedName: "SAO PAULO, BRAZIL" },
        { name: "Santiago", address: { cityName: "Santiago" }, subType: "CITY", detailedName: "SANTIAGO, CHILE" },
        { name: "Lima", address: { cityName: "Lima" }, subType: "CITY", detailedName: "LIMA, PERU" },
        { name: "Bogota", address: { cityName: "Bogota" }, subType: "CITY", detailedName: "BOGOTA, COLOMBIA" },
      ].filter(a => 
        a.name.toLowerCase().includes(String(keyword).toLowerCase()) || 
        (a.iataCode && a.iataCode.toLowerCase().includes(String(keyword).toLowerCase())) ||
        (a.address?.cityName && a.address.cityName.toLowerCase().includes(String(keyword).toLowerCase()))
      );
      return res.json(mockLocations);
    }

    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      res.json(response.data.data || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch airports" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    const { name, mobile, countryCode, email, description } = req.body;
    
    // MOCK EMAIL SERVICE LOGGING
    console.log("==========================================");
    console.log("NEW CONTACT ENQUIRY RECEIVED");
    console.log("DESTINATION: ops@fortisny.co");
    console.log("------------------------------------------");
    console.log(`From: ${name} <${email}>`);
    console.log(`Mobile: ${countryCode} ${mobile}`);
    console.log(`Description: ${description}`);
    console.log("==========================================");

    // Real Email Integration
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || email,
        to: "ops@fortisny.co",
        subject: `New Enquiry from ${name}`,
        text: `
Name: ${name}
Email: ${email}
Mobile: ${countryCode} ${mobile}

Description:
${description}
        `,
        replyTo: email
      };

      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to ops@fortisny.co");
      } else {
        console.warn("SMTP credentials missing. Email not sent, only logged to console.");
      }
      
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send message" });
    }
  });

  // Simulated real-time price updates via WebSockets
  io.on("connection", (socket) => {
    console.log("Client connected for live sync");
    
    const interval = setInterval(() => {
      // Simulate a GDS price jump or seat availability change
      const update = {
        type: "PRICE_UPDATE",
        data: {
          id: Math.floor(Math.random() * 3) + 1, // Target one of our mock packages
          newPrice: Math.floor(Math.random() * 500) + 100,
          isLastSeat: Math.random() > 0.8,
          currency: "AED",
          timestamp: new Date().toISOString()
        }
      };
      socket.emit("sync_update", update);
    }, 8000);

    socket.on("disconnect", () => {
      clearInterval(interval);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
