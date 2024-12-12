const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// ------ 3.1 ------

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// ------ 3.2 ------

app.get('/info', (request, response) => {
  const number = persons.length
  const currentDate = new Date();

  response.send(
    `<p>Phonebook has info for ${number} people</p>
     <p>${currentDate}</p>`
  )
})

// ------ 3.3 ------

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// ------ 3.4 ------

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// ------ 3.5 & 3.6 ------

const generateId = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

const checkNameExistence = (name) => {
  return persons.some(person => person.name === name);
};

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
 
  if (!name || !number) {
    return response.status(400).json({ 
      error: 'content missing' 
    });
  }

  if (checkNameExistence(name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person);

  response.json(person);
});

// --------------

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
