const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')

const app = express()
const port = process.env.PORT || 4000

const typeDefs = gql`
  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }
`

const resolvers = {
  Query: {
    notes: () => notes,
    note: (parent, { id }) => {
      return notes.find((note) => note.id === id)
    },
  },
  Mutation: {
    newNote: (parent, { content }) => {
      const note = {
        author: 'Dillon Morris',
        id: String(notes.length + 1),
        content,
      }
      notes.push(content)
      return note
    },
  },
}

let notes = [
  { id: '1', content: 'This is a JS note', author: 'Dillon Morris' },
  { id: '2', content: 'This is another JS note', author: 'Harlow Everly' },
  {
    id: '3',
    content: 'Oh hey look, another JS note!',
    author: 'Riley Harrison',
  },
]

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers })

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' })

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
)