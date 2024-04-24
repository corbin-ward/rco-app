// Importing necessary modules from Clerk, Next.js, and Stream Chat SDKs
import { clerkClient } from "@clerk/nextjs/server";
import { userAgent } from "next/server";
import { StreamChat } from "stream-chat";

// Function to handle POST requests
export async function POST(request: Request) {
    // Retrieving the Stream API key from environment variables
    const apiKey = process.env.STREAM_API_KEY;
    // Checking if API key exists
    if (!apiKey) {
        // Returning an error response if API key is missing
        return Response.error();
    }
    // Creating a Stream Chat server client instance using the API key and secret from environment variables
    const serverClient = StreamChat.getInstance(
        apiKey,
        process.env.STREAM_SECRET
    );
    // Parsing the JSON body of the request
    const body = await request.json();
    // Logging the request body for debugging purposes
    console.log('[/api/register-user] Body:', body);

    // Extracting user ID and email from the request body
    const userId = body?.userId;
    const mail = body?.email;

    // Checking if user ID or email is missing
    if (!userId || !mail) {
        // Returning an error response if user ID or email is missing
        return Response.error();
    }

    // Upserting (creating or updating) a user in the Stream Chat system
    const user = await serverClient.upsertUser({
        id: userId,
        role: 'user',
        name: mail,
        imageUrl: `https://getstream.io/random_png/?id=${userId}&name=${mail}`,
    });

    // Updating user metadata in the Clerk system
    const params = {
        publicMetadata: {
            streamRegistered: true,
        }
    };
    const updatedUser = await clerkClient.users.updateUser(userId, params);

    // Logging the updated user information for debugging purposes
    console.log('[/api/register-user] User:', updatedUser);
    // Creating a response object with user ID and email
    const response = {
        userId: userId,
        userName: mail,
    };

    // Returning a JSON response with user information
    return Response.json(response);
}
