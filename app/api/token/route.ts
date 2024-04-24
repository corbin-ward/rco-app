// Importing the StreamChat class from the 'stream-chat' module
import { StreamChat } from 'stream-chat';

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
    console.log('[/api/token] Body:', body);

    // Extracting user ID from the request body
    const userId = body?.userId;

    // Checking if user ID is missing
    if (!userId) {
        // Returning an error response if user ID is missing
        return Response.error();
    }

    // Creating a JWT token for the user ID using the Stream Chat server client
    const token = serverClient.createToken(userId);

    // Constructing a response object with user ID and token
    const response = {
        userId: userId,
        token: token,
    };

    // Returning a JSON response with the user ID and token
    return Response.json(response);
}