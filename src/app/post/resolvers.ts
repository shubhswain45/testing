import { prismaClient } from "../../api/prisma";

const queries = {
    getFeedPosts: async (parent: any, args: any) => {
        // Fetch the first 5 posts from the database along with the likes relation
        const posts = await prismaClient.post.findMany({
            take: 5, // Fetch the first 5 posts
            include: {
                likes: {
                    include: {
                        user: true, // Include user info for each like
                    },
                },
            },
        });

        if (!posts) {
            return []; // Return empty array if no posts are found
        }

        // Map the posts to include totalLikeCount and userHasLiked properties
        return posts.map(post => {
            // const userHasLiked = post.likes.some(like => like.userId === ctx.user?.id); // Check if the current user has liked the post

            return {
                ...post,
                totalLikeCount: post.likes.length, // Get the total number of likes
                userHasLiked: true, // Indicate if the current user has liked the post
            };
        });
    },
};

export const resolvers = {queries}