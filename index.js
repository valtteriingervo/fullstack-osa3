require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('data',
    function (req, res) {
        if (req.method === 'POST') {
            return JSON.stringify(req.body)
        }
        else {
            return ""
        }
    }
)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// GET all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
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
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.name === undefined) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Use this endpoint if none of the app. paths work out
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

// Heroku uses process.env.PORT
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})