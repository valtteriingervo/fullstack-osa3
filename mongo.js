const mongoose = require('mongoose')

// Handle wrong number of arguments
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
if (process.argv.length > 5) {
    console.log('too many arguments - 5 is max')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://valtteri:${password}@cluster0.c2vmhho.mongodb.net/peopleApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// Print people
if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(0)
    })
}
// Add new person
else {
    const personName = process.argv[3]
    const personNumber = process.argv[4]

    const person = new Person({
        name: personName,
        number: personNumber,
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}


