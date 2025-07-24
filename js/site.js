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

function updateUI(account) {
    const userInfo = document.getElementById('userInfo');
    const signInBtn = document.getElementById('signInBtn');
    if (account) {
        userInfo.textContent = `Signed in as: ${account.username}`;
        signInBtn.style.display = 'none';
        loadAppsForUser(account.username);
    } else {
        userInfo.textContent = '';
        signInBtn.style.display = 'inline-block';
        loadAppsForUser(null);
    }
}

function loadAppsForUser(email) {
    // Default apps file
    let appsFile = 'apps/defaultApps.json';
    if (email) {
        fetch('apps/accounts.json')
            .then(response => response.json())
            .then(accounts => {
                const entry = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
                if (entry && entry.appsFile) {
                    appsFile = 'apps/' + entry.appsFile;
                }
                renderApps(appsFile);
            })
            .catch(() => {
                renderApps(appsFile);
            });
    } else {
        renderApps(appsFile);
    }
}

function renderApps(appsFile) {
    fetch(appsFile)
        .then(response => response.json())
        .then(apps => {
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
            console.error('Failed to load ' + appsFile + ':', err);
        });
}

function goTo(site, isFullScreen) {
    if (isFullScreen) {
        location.href = 'https://www.youtube.com/redirect?q=' + site + '/';
    }
    else {
        location.href = site;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('signInBtn');
    // Hide main content until signed in and allowed
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = '';
    if (signInBtn) {
        signInBtn.onclick = async () => {
            try {
                await msalInstance.loginRedirect({ scopes: ["User.Read"] });
            } catch (err) {
                alert('Sign-in failed: ' + err.message);
            }
        };
    }

    msalInstance.handleRedirectPromise().then((loginResponse) => {
        if (loginResponse && loginResponse.account) {
            updateUI(loginResponse.account);
        } else {
            const currentAccounts = msalInstance.getAllAccounts();
            if (currentAccounts.length > 0) {
                updateUI(currentAccounts[0]);
            } else {
                updateUI(null);
            }
        }
    }).catch((err) => {
        alert('Sign-in failed: ' + err.message);
    });

    // Initial load: show default apps before any sign-in
    renderApps('apps/defaultApps.json');
});
