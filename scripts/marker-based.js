function startMarkerAR() {
    document.getElementById('marker-ar').style.display = 'block';
    document.getElementById('markerless-ar').innerHTML = '';
    document.getElementById('markerless-ar').style.display = 'none';
    console.log('Marker-based AR started');
}

document.addEventListener('DOMContentLoaded', () => {
    const marker = document.querySelector('#hiro-marker');
    
    marker.addEventListener('markerFound', () => {
        console.log('Marker Found!');
        alert('Marker Found!');
    });

    marker.addEventListener('markerLost', () => {
        console.log('Marker Lost!');
        alert('Marker Lost!');
    });
});
