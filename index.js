const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(morgan('tiny'))

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

app.use(express.json())
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/info',(request, response) => {
  response.send(`<p>phonebook has info for ${persons.length}</p>
    <br/>
    <p>${new Date()}</p>`)
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  console.log(request.body)
  
  if (!request.body.name||!request.body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  const { name, number } = request.body;
  if(persons.find(element=>element.name==name)){
    return response.status(400).json({ 
      error: 'ya existe el nombre' 
    })
  }
  if(persons.find(element=>element.number==number)){
    return response.status(400).json({ 
      error: 'ya existe el numero' 
    })
  }
  const person = {
    id: generateId(),
    name: name,
    number: number,
  }
  persons = persons.concat(person)
  response.json(person)  
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})