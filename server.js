const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

// GET /api/quotes/random - returns a random quote
app.get('/api/quotes/random', (req, res) => {
  const randomQuote = getRandomElement(quotes);
  res.json({ quote: randomQuote });
});

// GET /api/quotes - returns all quotes or filters by person
app.get('/api/quotes', (req, res) => {
  const { person } = req.query;
  
  if (person) {
    // Filter quotes by person
    const filteredQuotes = quotes.filter(quote => 
      quote.person.toLowerCase() === person.toLowerCase()
    );
    res.json({ quotes: filteredQuotes });
  } else {
    // Return all quotes
    res.json({ quotes: quotes });
  }
});

// POST /api/quotes - add a new quote
app.post('/api/quotes', (req, res) => {
  const { quote, person } = req.query;
  if (!quote || !person) {
    return res.status(400).send('Both quote and person are required.');
  }
  const newQuote = { quote, person };
  quotes.push(newQuote);
  res.status(201).json({ quote: newQuote });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

