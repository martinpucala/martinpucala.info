document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('#preview');
    const photoInput = document.querySelector('#photo');

    let imageFile = null;
    
    function doThings(e) {
        imageFile = [...photoInput.files][0] || imageFile;

        const reader = new FileReader();
        
        reader.addEventListener('load', function(e) {
            var img = new Image();
            img.addEventListener('load', function() {
                var q,
                    w = +document.querySelector('#ratio').value.split(':')[0],
                    h = +document.querySelector('#ratio').value.split(':')[1];
                
                if (isNaN(w)) {
                    w = defaultRatioWidth;
                }
                if (isNaN(h)) {
                    h = defaultRatioHeight;
                }
                
                q = img.height / h;
                canvas.width = Math.round(w * q);
                canvas.height = img.height;
                
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = document.querySelector('#fill').value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, (canvas.width - img.width) / 2, 0);
                
                document.querySelector('#output').src = canvas.toDataURL('image/jpeg', 1.0);
                document.querySelector('#output').className = 'loaded';
            });
            img.src = e.target.result;
        });
        
        reader.readAsDataURL(imageFile);
    }

    photoInput.addEventListener('change', doThings);
    document.querySelector('#ratio').addEventListener('change', doThings);
    document.querySelector('#fill').addEventListener('change', doThings);
});