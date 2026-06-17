# Roadmap

This page is ordered by priority.

It reflects the next features and platform work we actually want to build, not a speculative backlog.

## Features:

### Priority 1: Validate The PoC UI

The first goal is a proper user interface that the Donjon & Procrastination game creators can use to validate the proof of concept.

That means:

- a coherent end-to-end flow for browsing the catalog
- a UI that shows the value of the project beyond raw data tables
- an experience that is easy to demo, test, and explain
- enough polish to support a real review conversation with the creators

This is the highest-priority product item because it determines whether the project is useful in practice.

### Priority 2: Per-User Card Library

Create a personal card library for each user that tracks the cards they own.

This library should support:

- owned cards
- duplicate counts
- cards available for trade
- cards the user wants to keep or mark as not-for-trade
- a sharable public view so users can show off their collection

This becomes the foundation for collection tracking and later trading workflows.

### Priority 3: Constructed Deck Library

Create a utility for building, saving, and sharing constructed decks.

This should build on the user library so that deck construction can be grounded in actual owned cards.

Likely needs:

- deck creation and editing
- deck sharing links or public deck pages
- validation against the user’s owned collection
- a clean way to view deck composition and card counts

### Priority 4: Admin Card Management

Create an admin panel for adding and removing cards from the database without manual SQL or direct database operations.

This should only be available to admins.

Expected capabilities:

- add new cards
- remove deprecated cards
- update card metadata
- keep the card catalog in sync with new releases

This feature depends on authorization being more than a binary “logged in / logged out” check.

## Technical improvements

### Technical Priority 1: Environment Separation

We need a clean dev/prod split.

That means:

- separate configuration for development and production
- explicit environment-specific OIDC settings
- backend and frontend behavior that does not rely on hard-coded localhost values
- a documented checklist for spinning up each environment

### Technical Priority 2: Deployment

We need production infrastructure before the app can be treated as real software rather than a local demo.

Target work:

- deploy the web app to Vercel
- create a production database
- create a production Logto environment
- wire the production environment variables cleanly

### Technical Priority 3: Authorization

We need better authorization before building the admin panel.

Current auth says who the user is.
Next we need to say what that user is allowed to do.

Minimum requirements:

- distinguish admins from regular users
- protect admin-only routes
- make write operations explicit about who can perform them

This needs to land before the admin card-management UI.

### Technical Priority 4: Card Images And Blob Storage

We need to decide where card images live.

Questions to answer:

- do we store images in blob storage?
- do we want another database table for image metadata?
- do we use Vercel Blob or another storage provider?
- how do we map card records to image assets?

This is a design decision that should be settled before the catalog UI becomes image-heavy.
