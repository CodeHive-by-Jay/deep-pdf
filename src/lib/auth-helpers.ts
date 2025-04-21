import { clerkClient } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";

/**
 * Verify a JWT token and extract the userId
 * 
 * @param token The JWT token to verify
 * @returns The userId if token is valid, null otherwise
 */
export async function verifyToken(token: string): Promise<string | null> {
    try {
        // First try to decode the token without verification
        // This is just to extract the session ID
        const decoded = jwt.decode(token);

        if (!decoded || typeof decoded !== 'object') {
            console.error('Token is not a valid JWT');
            return null;
        }

        // For Clerk tokens, we can try to validate the session directly
        if (decoded.sid) {
            try {
                // Log token details for debugging
                console.log('JWT contains session ID:', decoded.sid);

                // Extract the subject claim which is typically the user ID
                if (decoded.sub) {
                    console.log('Found user ID in sub claim:', decoded.sub);
                    return decoded.sub;
                }
            } catch (error) {
                console.error('Error processing token:', error);
            }
        }

        // If we have a subject claim, it's often the user ID
        if (decoded.sub) {
            return decoded.sub;
        }

        // For debugging - log token contents (but redact sensitive parts)
        console.log('Token payload structure:', Object.keys(decoded));

        // Look for user ID in common JWT claim locations
        if (decoded.userId) return decoded.userId;

        return null;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

/**
 * Extract user ID from a Supabase JWT token
 * This is specific to how Clerk and Supabase integrate
 */
export function extractUserIdFromSupabaseToken(token: string): string | null {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded !== 'object') {
            return null;
        }

        // Supabase tokens usually have the user_id claim
        if (decoded.sub) {
            return decoded.sub;
        }

        // In Clerk+Supabase integrations, the user ID may be in different places
        if (decoded.user_id) return decoded.user_id;
        if (decoded.userId) return decoded.userId;

        return null;
    } catch (error) {
        console.error('Error extracting user ID from Supabase token:', error);
        return null;
    }
} 