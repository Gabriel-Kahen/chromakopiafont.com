var canvas = document.getElementById('wordCanvas');
var ctx = canvas.getContext('2d');
var wordInput = document.getElementById('wordInput');
var textColorInput = document.getElementById('textColorInput');
var defaultTextColorCheckbox = document.getElementById('defaultTextColor');
var bgColorInput = document.getElementById('bgColorInput');
var bgTransparentCheckbox = document.getElementById('bgTransparent');

function initializeCanvas() {
    handleBgTransparency();
    handleTextColorDefault();
    generateImage();
}

function handleBgTransparency() {
    var bgTransparent = bgTransparentCheckbox.checked;

    bgColorInput.disabled = bgTransparent;
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
    var textColor = textColorInput.value;
    var bgColor = bgColorInput.value;
    var bgTransparent = bgTransparentCheckbox.checked;

    if (word.length < 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    var fontSize = 100; //adjust maybe

    var font1 = new FontFaceObserver('FontType1');
    var font2 = new FontFaceObserver('FontType2');
    var font3 = new FontFaceObserver('FontType3');

    Promise.all([font1.load(), font2.load(), font3.load()]).then(function() {
        var firstLetter = word.charAt(0);
        var middleLetters = word.slice(1, -1);
        var lastLetter = word.charAt(word.length - 1);

        ctx.font = fontSize + 'px FontType1';
        var firstLetterWidth = ctx.measureText(firstLetter).width;

        ctx.font = fontSize + 'px FontType2';
        var middleLettersWidth = ctx.measureText(middleLetters).width;

        ctx.font = fontSize + 'px FontType3';
        var lastLetterWidth = ctx.measureText(lastLetter).width;

        var totalTextWidth = firstLetterWidth + middleLettersWidth + lastLetterWidth;

        var padding = 50; //adjust maybe

        var contentWidth = totalTextWidth + padding * 2;
        var contentHeight = fontSize + padding * 2;

        var squareSize = Math.max(contentWidth, contentHeight);

        canvas.width = squareSize;
        canvas.height = squareSize;

        ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!bgTransparent) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = textColor;

        var x = (canvas.width - totalTextWidth) / 2;
        var y = (canvas.height + fontSize * 0.7) / 2;

        ctx.font = fontSize + 'px FontType1';
        ctx.fillText(firstLetter, x, y);
        x += firstLetterWidth;

        if (middleLetters.length > 0) {
            ctx.font = fontSize + 'px FontType2';
            ctx.fillText(middleLetters, x, y);
            x += middleLettersWidth;
        }

        ctx.font = fontSize + 'px FontType3';
        ctx.fillText(lastLetter, x, y);

    }).catch(function(error) {
        console.error('Error loading fonts:', error);
        alert('There was an error loading the fonts. Please check the console for more details.');
    });
}

// Function to download the image or open it in a new tab for iOS
function downloadImage() {
    var word = wordInput.value.trim();

    if (word.length < 2) {
        alert('Please enter a word with at least two letters before downloading.');
        return;
    }

    // Generate the canvas as a PNG image
    var image = canvas.toDataURL('image/png');

    // Check if the browser supports the download attribute
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        // If the download attribute is supported, trigger the download
        link.href = image;
        link.download = word + '.png';
        link.click();
    } else {
        // Otherwise, open the image in a new tab
        window.open(image, '_blank');
    }
}

// Event listener for the Download Image button
downloadButton.addEventListener('click', function() {
    downloadImage();
});

downloadButton.addEventListener('click', function() {
    downloadImage();
});

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

window.onload = function() {
    initializeCanvas();
};