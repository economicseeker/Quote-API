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
  // Find the max id in the current quotes array
  const maxId = quotes.length > 0 ? Math.max(...quotes.map(q => q.id)) : 0;
  const newQuote = { id: maxId + 1, quote, person };
  quotes.push(newQuote);
  res.status(201).json({ quote: newQuote });
});

// PUT /api/quotes/:id - update a quote by id
app.put('/api/quotes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quote, person } = req.query;
  const quoteObj = quotes.find(q => q.id === id);
  if (!quoteObj) {
    return res.status(404).send('Quote not found.');
  }
  if (quote) quoteObj.quote = quote;
  if (person) quoteObj.person = person;
  res.json({ quote: quoteObj });
});

// DELETE /api/quotes/:id - delete a quote by id
app.delete('/api/quotes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).send('Quote not found.');
  }
  const deleted = quotes.splice(index, 1)[0];
  res.json({ quote: deleted });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

