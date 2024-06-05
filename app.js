document.getElementById("start-ar").addEventListener("click", startAR);

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

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}
