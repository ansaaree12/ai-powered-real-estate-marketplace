import { auth } from 'express-oauth2-jwt-bearer';


const jwtCheck = auth({
    audience: "https://dev-yb031yf6nqzlmezk.us.auth0.com/api/v2/", // Use the correct API Identifier
    issuerBaseURL: "https://dev-yb031yf6nqzlmezk.us.auth0.com",    // Auth0 domain
    tokenSigningAlg: "RS256",
});

export default jwtCheck;
