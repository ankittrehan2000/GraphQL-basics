const express = require('express');
const graphqlHTTP = require('express-graphql')
const app = express();

const schema = require('./schema')

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(3030);
console.log('listening')