import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// All routes are public for now (waitlist landing page only)
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // All routes are public for the waitlist
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
