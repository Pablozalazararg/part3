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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    console.log(person)
    response.json(person)
    
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = person.find(note => note.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  person = person.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const {nombre,number} = request.body
  const person = new Person({
    nombre: nombre,
    number: number,
  })
  console.log(person.id, person.name)
  person.save().then(savedNote => {
    response.json(savedNote)
  })
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})