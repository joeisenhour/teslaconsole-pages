# Tesla Console

## Purpose
This website provides a full-screen, app-like experience for web apps that are not natively supported by the Tesla infotainment system built into Tesla cars. It is designed to make popular streaming, navigation, and utility web apps easily accessible in a format that feels like a native Tesla app. Just visit and bookmark https://tesla.frostynixon.com from your Tesla browser.

## How Apps Work
- The site opens apps by bouncing the url off of the tesla youtube app url, thus creating a full-screen/app like experience in your tesla car console.
- The site displays a default list of apps from `apps/defaultApps.json` for all users, including those who are not signed in.
- When a user signs in with a Microsoft account, the site checks `apps/accounts.json` for a mapping between their **oid** (Object ID, shown in the top-right banner after sign-in) and a custom app list JSON file.
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
   - Add an entry to `apps/accounts.json` with your Microsoft account **oid** and the name of your custom app list file. 
   - You can find your oid in the top-right banner after signing in.
   - Example entry:
     ```json
     {
       "oid": "00000000-0000-0000-bfee-16b06b814cd4",
       "appsFile": "myCustomApps.json"
     }
     ```
   - The oid is a unique identifier for your Microsoft account and is not considered sensitive information for this purpose.
3. **Test your changes locally or on GitHub Pages.**

## Submitting a Pull Request
- You are welcome to submit a pull request to add a new custom app JSON and account entry in `apps/accounts.json`.
- The repo owner reserves the right to refuse any pull request that contains adult or offensive material, or links to such material.

## Notes
- All app icons should be placed in the `images` directory and referenced accordingly in your app list JSON
- Only Microsoft consumer accounts are supported for sign-in
- For local development, use Live Server or a similar tool and ensure you access using http://localhost:5500
- Feel free to make the site better, e.g. support other types of consumer accounts