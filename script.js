var canvas = document.getElementById('wordCanvas');
var ctx = canvas.getContext('2d');
var wordInput = document.getElementById('wordInput');
var textColorInput = document.getElementById('textColorInput');
var defaultTextColorCheckbox = document.getElementById('defaultTextColor');
var bgColorInput = document.getElementById('bgColorInput');
var bgColorLabel = document.querySelector('label[for="bgColorInput"]');
var bgTransparentLabel = document.querySelector('label[for="bgTransparent"]');
var bgTransparentCheckbox = document.getElementById('bgTransparent');
var bgImageInput = document.getElementById('bgImageInput');
var generatedImage = document.getElementById('generatedImage');
var uploadedBgImage = null;

bgImageInput.addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            uploadedBgImage = img;
            bgColorLabel.textContent = "Background Tint:";
            bgTransparentLabel.textContent = "Remove Tint";
            generateImage();
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

function initializeCanvas() {
    handleBgTransparency();
    handleTextColorDefault();
    generateImage();
}

function handleBgTransparency() {
    if (uploadedBgImage) {
        bgColorInput.disabled = false;
    } else {
        var bgTransparent = bgTransparentCheckbox.checked;
        bgColorInput.disabled = bgTransparent;
    }
}

function handleTextColorDefault() {
    var defaultTextColor = defaultTextColorCheckbox.checked;
    if (defaultTextColor) {
        textColorInput.value = '#01823f';
        textColorInput.disabled = true;
    } else {
        textColorInput.value = '#000000';
        textColorInput.disabled = false;
    }
}

function generateImage() {
    var word = wordInput.value.trim();
    word = word.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
    var textColor = textColorInput.value;
    var bgColor = bgColorInput.value;
    var bgTransparent = bgTransparentCheckbox.checked;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var fontsize2 = 100;
    var fontsize1 = fontsize2 * 2.5;
    var fontsize3 = fontsize2 * 2.5;

    var padding = 50;
    var squareSize = canvas.width = canvas.height = 500;

    if (uploadedBgImage && word.length < 2) {
        ctx.drawImage(uploadedBgImage, 0, 0, canvas.width, canvas.height);
        if (!bgTransparent) {
            ctx.fillStyle = bgColor;
            ctx.globalAlpha = 0.7;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.globalAlpha = 1.0;
        generatedImage.src = canvas.toDataURL('image/png');
        generatedImage.style.display = 'block';
        return;
    }

    var font1 = new FontFaceObserver('FontType1');
    var font2 = new FontFaceObserver('FontType2');
    var font3 = new FontFaceObserver('FontType3');

    Promise.all([font1.load(), font2.load(), font3.load()]).then(function() {
        var firstLetter = word.charAt(0);
        var middleLetters = word.slice(0, -1);
        var lastLetter = word.charAt(word.length - 1);

        ctx.font = fontsize1 + 'px FontType1';
        var firstLetterWidth = ctx.measureText(firstLetter).width;

        ctx.font = fontsize2 + 'px FontType2';
        var middleLettersWidth = ctx.measureText(middleLetters).width;

        ctx.font = fontsize3 + 'px FontType3';
        var lastLetterWidth = ctx.measureText(lastLetter).width;

        var totalTextWidth = firstLetterWidth + middleLettersWidth + lastLetterWidth + 53;

        var contentWidth = totalTextWidth + padding * 2;
        var contentHeight = fontsize1 + padding * 2;

        squareSize = Math.max(contentWidth, contentHeight);
        canvas.width = squareSize;
        canvas.height = squareSize;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (uploadedBgImage) {
            var imgWidth = uploadedBgImage.width;
            var imgHeight = uploadedBgImage.height;
            var sideLength = Math.min(imgWidth, imgHeight);
            var sx = (imgWidth - sideLength) / 2;
            var sy = (imgHeight - sideLength) / 2;
            ctx.drawImage(
                uploadedBgImage, // Image
                sx, sy,          // Source x and y
                sideLength, sideLength, // Source width and height
                0, 0,            // Destination x and y on the canvas
                canvas.width, canvas.height // Destination width and height on the canvas
            );
            if (!bgTransparent) {
                ctx.fillStyle = bgColor;
                ctx.globalAlpha = 0.7;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.globalAlpha = 1.0;
        } else if (!bgTransparentCheckbox.checked) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = textColor;

        var x = (canvas.width - totalTextWidth) / 2;
        var y = (canvas.height) / 2 + 32;

        ctx.font = fontsize1 + 'px FontType1';
        ctx.fillText(firstLetter, x, y);

        x += firstLetterWidth + (firstLetterWidth * 0.1);
        if (middleLetters.length > 0) {
            ctx.font = fontsize2 + 'px FontType2';
            ctx.fillText(middleLetters, x, y);
            x += middleLettersWidth;
        }

        ctx.font = fontsize3 + 'px FontType3';
        ctx.fillText(lastLetter, x, y);

        var imageData = canvas.toDataURL('image/png');
        generatedImage.src = imageData;
        generatedImage.style.display = 'block';
    }).catch(function(error) {
        console.error('Error loading fonts:', error);
        alert('There was an error loading the fonts. Please check the console for more details.');
    });
}

wordInput.addEventListener('input', function() {
    generateImage();
});

textColorInput.addEventListener('input', function() {
    generateImage();
});

defaultTextColorCheckbox.addEventListener('change', function() {
    handleTextColorDefault();
    generateImage();
});

bgColorInput.addEventListener('input', function() {
    generateImage();
});

bgTransparentCheckbox.addEventListener('change', function() {
    handleBgTransparency();
    generateImage();
});

document.querySelector('.upload-btn').addEventListener('click', function() {
    document.getElementById('bgImageInput').click();
});

window.onload = function() {
    initializeCanvas();
};