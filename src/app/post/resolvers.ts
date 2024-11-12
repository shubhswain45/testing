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

const mutations = {
    likePost: async (parent: any, { postId }: { postId: string }) => {
        // Ensure the user is authenticated

        try {
            // Attempt to delete the like (unlike the post)
            await prismaClient.like.delete({
                where: {
                    userId_postId: {
                        userId: "V",  // User ID from the context
                        postId,
                    }
                }
            });

            // If successful, return a response indicating the post was unliked
            return false; // Post was unliked

        } catch (error: any) {
            // If the like doesn't exist, handle the error and create the like (like the post)
            if (error.code === 'P2025') { // This error code indicates that the record was not found
                // Create a like entry (Prisma will automatically link the user and post)
                await prismaClient.like.create({
                    data: {
                        userId: "v",  // User ID from the context
                        postId,  // Post ID to associate the like with
                    }
                });
                return true; // Post was liked
            }

            // Handle any other errors
            console.error("Error toggling like:", error);
            throw new Error(error.message || "An error occurred while toggling the like on the post.");
        }
    }
}
export const resolvers = {queries, mutations}