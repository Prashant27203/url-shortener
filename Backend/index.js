import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import qrcode from "qrcode";

const app = express();
app.use(cors()); // Used to allow cross-origin resource sharing
app.use(express.json()); // Middleware for parsing JSON requests
const port = 3000;

// Connection to the database
mongoose
  .connect("mongodb://localhost:27017/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Established to the Database");
  })
  .catch((err) => {
    console.log("FAILED TO ESTABLISH THE CONNECTION: " + err);
  });

// Defining the schema of the database
const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  OriginalUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  visitHistory: [
    {
      timestamp: {
        type: Date,
        default: Date.now, // Set default value to current date
      },
    },
  ],
});

const UrlModel = mongoose.model("Url", urlSchema);

// Route to create a short URL
app.post("/api/short", async (req, res) => {
  try {
    const { OriginalUrl } = req.body;

    if (!OriginalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    const shortId = nanoid(8);
    const newUrl = new UrlModel({
      shortId,
      OriginalUrl,
    });

    await newUrl.save();

    const myUrl = `http://localhost:3000/${shortId}`; // Correct shortId variable name
    const qrcodeImg = await qrcode.toDataURL(myUrl);

    return res.status(200).json({
      message: "Short URL Created",
      shortId: shortId,
      qrcodeImg: qrcodeImg,
    });
  } catch (err) {
    console.error(err); // Use console.error for errors
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to redirect to the original URL
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const urlEntry = await UrlModel.findOne({ shortId: shortId });

    if (!urlEntry) {
      return res.status(404).json({ message: "URL Not Found" });
    }

    urlEntry.clicks++;
    urlEntry.visitHistory.push({ timestamp: new Date() }); // Record visit time
    await urlEntry.save();

    return res.redirect(urlEntry.OriginalUrl);
  } catch (err) {
    console.error(err); // Use console.error for errors
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});
