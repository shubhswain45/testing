export const types = `#graphql
# Post type
type Post {
    id: ID!
    content: String
    imgURL: String!
    totalLikeCount: Int!  # Total number of likes for the post
    userHasLiked: Boolean!  # Indicates whether the authenticated user has liked the post
}
`
