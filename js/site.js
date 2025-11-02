// Copied from wwwroot/js/site.js

// MSAL.js authentication setup
const msalConfig = {
    auth: {
        clientId: "415c3cb6-df40-4b22-a959-dbab85371a55", // Replace with your Azure AD client ID
        authority: "https://login.microsoftonline.com/consumers", // Microsoft consumer accounts
        redirectUri: window.location.origin
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

function updateUI(account, idTokenRaw) {
    const userInfo = document.getElementById('userInfo');
    const signInBtn = document.getElementById('signInBtn');
    const userThumb = document.getElementById('userThumb');
    const accountDropdown = document.getElementById('accountDropdown');
    if (account) {
        // Parse idToken for oid and email
        let email = account.username || '';
        let oid = '';
        let thumbUrl = '';
        if (idTokenRaw) {
            try {
                const base64Url = idTokenRaw.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const tokenObj = JSON.parse(jsonPayload);
                oid = tokenObj.oid || '';
                // Try to get thumbnail image from idToken (if present)
                if (tokenObj.picture) {
                    thumbUrl = tokenObj.picture;
                }
            } catch (e) {}
        }
        // Update user info bar
        userInfo.innerHTML = `<span style="font-size:13px; color:#666;">${email}</span><span style="font-size:11px; color:#999;">${oid}</span>`;
        userInfo.onclick = function(e) {
            e.stopPropagation();
            if (accountDropdown.style.display === 'block') {
                accountDropdown.style.display = 'none';
            } else {
                accountDropdown.style.display = 'block';
            }
        };
        document.addEventListener('click', function hideDropdown(ev) {
            if (accountDropdown.style.display === 'block' && !userInfo.contains(ev.target) && !accountDropdown.contains(ev.target)) {
                accountDropdown.style.display = 'none';
            }
        });
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.onclick = function() {
                msalInstance.logoutRedirect();
            };
        }
        accountDropdown.style.display = 'none';
        signInBtn.style.display = 'none';
        if (userThumb) {
            if (thumbUrl) {
                userThumb.src = thumbUrl;
                userThumb.style.display = '';
            } else {
                userThumb.src = '';
                userThumb.style.display = 'none';
            }
        }
        loadAppsForOid(oid);
    } else {
        userInfo.innerHTML = '';
        signInBtn.style.display = 'inline-block';
        if (userThumb) userThumb.style.display = 'none';
        loadAppsForOid(null);
    }
}

function loadAppsForOid(oid) {
    // Default apps file
    let appsFile = 'apps/defaultApps.json';
    if (oid) {
        fetch('apps/accounts.json')
            .then(response => response.json())
            .then(accounts => {
                const entry = accounts.find(acc => acc.oid && acc.oid.toLowerCase() === oid.toLowerCase());
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
    } else {
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
            updateUI(loginResponse.account, loginResponse.idToken);
        } else {
            const currentAccounts = msalInstance.getAllAccounts();
            if (currentAccounts.length > 0) {
                // Try to acquire a fresh idToken silently
                msalInstance.acquireTokenSilent({
                    account: currentAccounts[0],
                    scopes: ["User.Read"]
                }).then(tokenResponse => {
                    updateUI(currentAccounts[0], tokenResponse.idToken);
                }).catch(() => {
                    // If silent fails, prompt interactive sign-in
                    msalInstance.loginRedirect({ scopes: ["User.Read"] });
                });
            } else {
                updateUI(null, null);
            }
        }
    }).catch((err) => {
        alert('Sign-in failed: ' + err.message);
    });

    // Initial load: show default apps before any sign-in
    renderApps('apps/defaultApps.json');
});
