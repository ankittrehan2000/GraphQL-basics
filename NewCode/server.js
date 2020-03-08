const express = require('express');
const expressGraphQL = require('express-graphql');

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const app = express();

const authors = [
    {id: 1, name: 'JK Rowling'}
]

const books = [
    {id: 1, name:'Harry potter', authorid:1}
]

//creating the schema
/*const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'LearnGraphQL',
        fields: () => ({     
            message: {
                GraphQLString,
                resolve: () => 'Hello World'        //how to return data for the requst to the api
            }
        })
    })
})*/


//Graph QL Types use functions because they reference each other and they should be intitated before loading the page.

const AuthorType = newGraphQLObjectType({
    name: 'Author',
    description: 'An author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {type: new GraphQLList(BookType),
        resolve: (author) => {
            return books.filter(book => book.authorId === author.id)
        }}
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Book written by a author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {type: AuthorType,
        resolve: (book) => {
            return authors.find(author => author.id === book.authorId)
        }}
    })
})

//creating root query
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({                            //return everything inside paranthesis
        books: {
            type: BookType,    //not returning a list, just a single booktype
            description: 'A single book',
            args: {
                id: { type: GraphQLInt }   //defining the arguments accepted
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)   //if there was a database you would do database queries to perform this
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'list of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'Author of a book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent,args) => author.find(author => author.id === args.id)
        }
    })
})


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book to the database',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt )},
            },
            resolve: (parents,args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId}
                books.push(book)
                return(book)
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent,args) => {
                const author = { id: author.length + 1, name: args.name}
                authors.push(author)
                return author
            }
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType             //GraphQL's equivalent of a post or update
})

app.use('/graphql', (req,res) => expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(3030, () => console.log('Listening'))