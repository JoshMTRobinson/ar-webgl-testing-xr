document.getElementById("start-ar").addEventListener("click", startAR);
document.getElementById("start-fullscale-ar").addEventListener("click", startFullScaleAR);
document.getElementById('loader').style.display = 'none';
function startAR() {
    const unsupportedMessage = document.getElementById('unsupported-message');

    if (isIOS()) {
        unsupportedMessage.style.display = 'none';
        document.getElementById('quick-look').click();
    } else if (isAndroid()) {
        unsupportedMessage.style.display = 'none';
        // Construct model URL
        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        const modelUrl = new URL('model/model.glb', baseUrl).href;
        console.log("Constructed model URL:", modelUrl); // Log the model URL

        // Android Scene Viewer Intent
        const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar-preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;

        const anchor = document.createElement('a');
        anchor.setAttribute('href', intentUrl);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    } else {
        unsupportedMessage.style.display = 'block';
    }
}

function startFullScaleAR() {
    const unsupportedMessage = document.getElementById('unsupported-message');
    document.getElementById('loader').style.display = 'block';
    if (isIOS()) {
        unsupportedMessage.style.display = 'none';
        // Assuming the full scale model for iOS is named model_fullscale.usdz
        document.getElementById('quick-look').href = 'model/model_fullscale.usdz';
        document.getElementById('quick-look').click();
    } else if (isAndroid()) {
        unsupportedMessage.style.display = 'none';
        // Assuming the full scale model for Android is named model_fullscale.glb
        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        const modelUrl = new URL('model/model_fullscale.glb', baseUrl).href;
        console.log("Constructed full scale model URL:", modelUrl);

        const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar-preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;

        const anchor = document.createElement('a');
        anchor.setAttribute('href', intentUrl);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    } else {
        unsupportedMessage.style.display = 'block';
    }
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}
