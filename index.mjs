import express from 'express';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

// In-memory database to store URL mappings
const urlDatabase = {};

// To get the __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form for URL shortening
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle URL shortening
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;

  if (!isValidUrl(longUrl)) {
    return res.status(400).send('Invalid URL');
  }

  const shortUrl = nanoid(8);
  urlDatabase[shortUrl] = longUrl;

  res.send(`Shortened URL: http://localhost:${PORT}/${shortUrl}`);
});

// Redirect to the original URL when a short URL is accessed
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Helper function to check if a URL is valid
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
