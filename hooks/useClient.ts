// Importing necessary modules from React and Stream Chat SDK
import { useEffect, useState } from 'react';
import { StreamChat, TokenOrProvider, User } from 'stream-chat';

// Defining a type for options used in the custom hook
export type UseClientOptions = {
    apiKey: string;
    user: User;
    tokenOrProvider: TokenOrProvider;
}

// Custom hook to manage Stream Chat client instance
export const useClient = ({
    apiKey,
    user,
    tokenOrProvider,
}: UseClientOptions): StreamChat | undefined => {
    // Using React state to manage the chat client instance
    const [chatClient, setChatClient] = useState<StreamChat>();

    // useEffect hook to handle side effects when component mounts or dependencies change
    useEffect(() => {
        // Creating a new Stream Chat client instance with the provided API key
        const client = new StreamChat(apiKey);
        // Boolean flag to check if user connection was interrupted
        let didUserConnectInterrupt = false;

        // Establishing a connection with the Stream Chat server using the provided user details
        const connectionPromise = client
            .connectUser(user, tokenOrProvider)
            .then(() => {
                // If user connection was not interrupted, setting the chat client in state
                if (!didUserConnectInterrupt) {
                    setChatClient(client);
                }
            });

        // Cleanup function to be called when component unmounts or dependencies change
        return () => {
            // Setting the flag to indicate user connection interruption
            didUserConnectInterrupt = true;
            // Clearing the chat client instance from state
            setChatClient(undefined);
            // Initiating disconnection sequence after connection completes
            connectionPromise
                .then(() => client.disconnectUser())
                .then(() => {
                    console.log('Connection closed');
                });
        };
        // Dependency array for useEffect hook, re-run the effect only if user ID changes
    }, [apiKey, user.id, tokenOrProvider]);

    // Returning the chat client instance
    return chatClient;
};
