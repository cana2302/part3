const express = require('express');
const app = express();
require('dotenv').config();

const Person = require('./models/person');

app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const cors = require('cors'); 

app.use(cors());
app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
};

// ------ GET /api/persons ------

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

// ------ GET /info ------
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const number = persons.length;
    const currentDate = new Date();

    response.send(
      `<p>Phonebook has info for ${number} people</p>
      <p>${currentDate}</p>`
    );
  })
});

// ------ GET /api/persons/2 -------
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});

// ------ POST ------
const checkNameExistence = (name) => {
  Person.find({name:name}).then(persons =>{
    return persons.length > 0;
  })
};

app.post('/api/persons', (request, response, next) => {
  const body = request.body
 
  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({ error: 'content missing' })
  }

  if (checkNameExistence(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
});

// ------ PUT ------
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// ------ DELETE ------
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// ------ unknown endpoint --------
app.use(unknownEndpoint);
// ------ error handler --------
app.use(errorHandler)

// ------- PORT ---------
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});