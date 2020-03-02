const fetch = requre('node-fetch');
const util = require('util');
//so that xml2js returns a promise instead of callback
const parseXML = util.promisify(require('xml2js').parseString)

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

const BookeType = new GraphQLObjectType({
    name: 'Book',
    description: '...',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml => xml.title[0]
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => xml.isbn[0]
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => 
                xml.GoodReadsResponse.author[0].name[0]
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: xml => {
                //xml to json conversion problems :(
                xml.GoodReadsResponse.author[0].books[0].book
            }
        }
    })
}) 

//Provides the data from the fetch call to the authorType
module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (root, args) => fetch(
                `https://www.goodreads.com/author/show.xml?id=${id}&key=yourApiKey`
                )
            .then(response => response.text())
            .then(parseXML)
        }
        })
    })
})