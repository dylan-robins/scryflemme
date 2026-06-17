# @scryflemme/types

Single source of truth for API contracts shared between the backend and frontend.

Keep this package limited to type-only definitions that describe data exchanged between apps.
If a shape changes in the API, update it here first and import it from both apps instead of
duplicating local interfaces.
