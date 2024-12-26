require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(express.json())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
    
  })
})

app.get('/api/persons/:id', (request, response , next ) => {
  Person.findById(request.params.id)
  .then(element => {
    if(element) {
    response.json(element)
   } else {
    response.status(404).end()
   }
  })
  .catch((error)=> next(error))
})
app.get("/info", (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.send(
        `<p>Phonebook has info for ${
          people.length
        } people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});
app.put('/api/persons/:id', (request, response, next) => {
  const { content, important } = request.body

  Person.findByIdAndUpdate(
    request.params.id, 
    { nombre, number },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
});
app.delete("/api/persons/:id", (request, response, next) => {
  
  Person.findByIdAndDelete(request.params.id)
    .then((result) => { response.status(204).end()
    })
    .catch((error) => next(error))
});

app.post('/api/persons', (request, response, next) => {
 
  const {nombre,number} = request.body
  const person = new Person({
    nombre: nombre,
    number: number,
  })
  
  person.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch((error)=>next(error))
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})