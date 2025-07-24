// Copied from wwwroot/js/site.js

// MSAL.js authentication setup
const msalConfig = {
    auth: {
        clientId: "d560834e-ab2c-4bfe-bef8-3e65f6583c24", // Replace with your Azure AD client ID
        authority: "https://login.microsoftonline.com/consumers", // Microsoft consumer accounts
        redirectUri: window.location.origin
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// Allowed accounts array is now global
const allowedAccounts = ["teslaconsole-pages@hotmail.com"];

function updateUI(account) {
    const userInfo = document.getElementById('userInfo');
    const signInBtn = document.getElementById('signInBtn');
    const mainContent = document.querySelector('main');
    if (account && allowedAccounts.includes(account.username.toLowerCase())) {
        userInfo.textContent = `Signed in as: ${account.username}`;
        signInBtn.style.display = 'none';
        if (mainContent) mainContent.style.display = '';
    } else if (account) {
        userInfo.textContent = `Account not allowed: ${account.username}`;
        signInBtn.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
    } else {
        userInfo.textContent = '';
        signInBtn.style.display = 'inline-block';
        if (mainContent) mainContent.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('signInBtn');
    // Hide main content until signed in and allowed
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'none';
    if (signInBtn) {
        signInBtn.onclick = async () => {
            try {
                const loginResponse = await msalInstance.loginPopup({ scopes: ["User.Read"] });
                updateUI(loginResponse.account);
            } catch (err) {
                alert('Sign-in failed: ' + err.message);
            }
        };
    }
    // Check if already signed in
    const currentAccounts = msalInstance.getAllAccounts();
    if (currentAccounts.length > 0) {
        updateUI(currentAccounts[0]);
    }

    // Dynamically load and render apps from apps.json
    fetch('apps.json')
        .then(response => response.json())
        .then(apps => {
            // Sort by sortname
            apps.sort((a, b) => a.sortname.localeCompare(b.sortname));
            const container = document.getElementById('apps-container');
            if (container) {
                container.innerHTML = '';
                apps.forEach(app => {
                    const div = document.createElement('div');
                    div.className = 'image-container';

                    const img = document.createElement('img');
                    img.src = app.img;
                    img.className = 'rounded-image';
                    img.onclick = () => goTo(app.goto, app.isFullscreen);

                    const label = document.createElement('label');
                    label.className = 'image-label';
                    label.textContent = app.name;

                    div.appendChild(img);
                    div.appendChild(label);
                    container.appendChild(div);
                });
            }
        })
        .catch(err => {
            console.error('Failed to load apps.json:', err);
        });
});
