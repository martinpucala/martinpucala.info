$(function() {
    var canvas = document.querySelector('#preview'),
        defaultRatioWidth = 5,
        defaultRatioHeight = 4;
    
    document.querySelector('#photo').onchange = function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var q,
                    w = +$('#ratio').val().split(':')[0],
                    h = +$('#ratio').val().split(':')[1];
                
                if (isNaN(w)) {
                    w = 4;
                }
                if (isNaN(h)) {
                    h = 5;
                }
                
                q = img.height / h;
                canvas.width = Math.round(w * q);
                canvas.height = img.height;
                
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = $('#fill').val();
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, (canvas.width - img.width) / 2, 0);
                
                document.querySelector('#output').src = canvas.toDataURL('image/jpeg', 1.0);
                document.querySelector('#output').className = 'loaded';
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    };
});