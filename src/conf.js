const conf = {
    stripePublishableKey: String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}
export default conf