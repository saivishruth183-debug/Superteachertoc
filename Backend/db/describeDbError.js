// Turns a MongoDB/Mongoose error into a short, safe explanation (no secrets).
const describeDbError = (error) => {
    const text = `${error?.name || ""} ${error?.message || ""} ${error?.codeName || ""}`;

    if (/bad auth|Authentication failed|AuthenticationFailed/i.test(text)) {
        return "MongoDB rejected the username or password in MONGODB_URI. Check the database user in Atlas → Database Access, and URL-encode special characters in the password (e.g. @ → %40).";
    }
    if (/MongoParseError|Invalid scheme|URI must include|Password contains unescaped/i.test(text)) {
        return "MONGODB_URI is not a valid connection string. It must start with mongodb+srv:// or mongodb://, with no quotes or spaces, and special characters in the password URL-encoded.";
    }
    if (/querySrv|ENOTFOUND|EAI_AGAIN/i.test(text)) {
        return "The MongoDB host in MONGODB_URI could not be found. Copy the connection string again from Atlas → Connect → Drivers.";
    }
    if (/ServerSelection|whitelist|IP|ECONNREFUSED|timed out|ETIMEDOUT/i.test(text)) {
        return "Could not reach MongoDB. In Atlas → Network Access, add 0.0.0.0/0 (Allow access from anywhere) so Vercel can connect, and check the cluster is not paused.";
    }
    return null;
};

export default describeDbError;
