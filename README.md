# Tesla Console Pages

## Purpose
This website provides a full-screen, app-like experience for web apps that are not natively supported by the Tesla infotainment system built into Tesla cars. It is designed to make popular streaming, navigation, and utility web apps easily accessible in a format that feels like a native Tesla app.

## How App Lists Work
- The site displays a default list of apps from `apps/defaultApps.json` for all users, including those who are not signed in.
- When a user signs in with a Microsoft account, the site checks `apps/accounts.json` for a mapping between their email and a custom app list JSON file.
- If a mapping exists, the user's custom app list is loaded from the specified JSON file in the `apps` directory.
- If no mapping exists, the default app list is shown.

## Adding a Custom App List
1. **Create a new app list JSON file:**
   - Place your new file in the `apps` directory (e.g., `apps/myCustomApps.json`).
   - The file should contain an array of app objects with the following properties:
     - `img`: Path to the app icon (e.g., `images/myapp.webp`)
     - `goto`: The URL to open for the app
     - `isFullscreen`: `true` or `false` for full-screen behavior
     - `name`: Display name for the app
     - `sortname`: Name used for sorting (optional, defaults to `name`)
2. **Map your account to the new app list:**
   - Add an entry to `apps/accounts.json` with a Microsoft account email and the name of your custom app list file. Any email address you add here will be visible to the entire world. So, it's probably a good idea to create a new Microsoft account/email just for this.
     ```json
     {
       "email": "your-email@example.com",
       "appsFile": "myCustomApps.json"
     }
     ```
3. **Test your changes locally or on GitHub Pages.**

## Submitting a Pull Request
- You are welcome to submit a pull request to add a new custom app JSON and account entry in `apps/accounts.json`.
- The repo owner reserves the right to refuse any pull request that contains adult or offensive material, or links to such material.

## Notes
- All app icons should be placed in the `images` directory and referenced accordingly in your app list JSON
- Only Microsoft consumer accounts are supported for sign-in
- For local development, use Live Server or a similar tool and ensure you access using http://localhost:5500
- Feel free to make the site better, e.g. support other types of consumer accounts