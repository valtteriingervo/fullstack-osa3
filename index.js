const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.use(morgan('tiny'))
app.use(express.json())

// Home page that greets the visitor
app.get('/', (request, response) => {
    response.send('<h1>Welcome to the persons site!</h1>')
})

// For getting all the persons JSON
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Info page for people amount and time
app.get('/info', (request, response) => {
    const personsLength = persons.length
    const lengthMsg = `Phonebook has info for ${personsLength} people`
    const dateMsg = new Date()
    const htmlMsg =
        `<p>${lengthMsg}</p>
         <p>${dateMsg}</p>`
    response.send(htmlMsg)
})

// For displaying a singular person
app.get('/api/persons/:id', (request, response) => {
    // Convert id from String to Number
    const id = Number(request.params.id)
    // Filter the wanted persons with given ID
    const wantedPerson = persons.find(persons => persons.id === id)
    if (wantedPerson) {
        response.json(wantedPerson)
    }
    else {
        response.status(404).end()
    }
})

// Delete certain person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    // Replace the persons variable with the persons array with deleted person
    // filtered out
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()
})

// Add new persons
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const isNameAlreadyInList
        = persons.find(person => person.name === body.name)

    if (isNameAlreadyInList) {
        return response.status(400).json({
            error: 'Name is already in the list. It must be unique'
        })
    }

    const person = {
        id: getRandomID(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})


const getRandomID = () => {
    return Math.floor(Math.random() * 10000);
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})