let canvas;
let currentColor = '#FF0000'; // Default to red
let brushSize = 5;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// For undo/redo functionality
let drawingHistory = [];
let currentStep = -1;

function setup() {
    // Create smaller canvas (600x400 instead of 700x500)
    canvas = createCanvas(600, 400);
    canvas.parent('canvas-container');
    background(255);
    
    // Save initial blank canvas state
    saveCanvasState();
    
    // Set up event listeners for controls
    document.getElementById('color').addEventListener('input', function() {
        currentColor = this.value;
    });
    
    const sizeSlider = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    
    sizeSlider.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        sizeValue.textContent = brushSize;
    });
    
    // Undo button
    document.getElementById('undo').addEventListener('click', function() {
        undoDrawing();
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    });
    
    // Redo button
    document.getElementById('redo').addEventListener('click', function() {
        redoDrawing();
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    });
    
    // Clear button
    document.getElementById('clear').addEventListener('click', function() {
        clearCanvas();
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    });
    
    // Disable undo/redo buttons initially
    updateUndoRedoButtons();
}

function draw() {
    // Only draw when mouse is pressed
    if (isDrawing) {
        stroke(currentColor);
        strokeWeight(brushSize);
        strokeCap(ROUND); // Make strokes round
        line(lastX, lastY, mouseX, mouseY);
        
        // Update lastX and lastY to the current mouse position
        lastX = mouseX;
        lastY = mouseY;
    }
}

function mousePressed() {
    // Start drawing
    isDrawing = true;
    lastX = mouseX;
    lastY = mouseY;
    
    // Draw a single point when just clicking
    stroke(currentColor);
    strokeWeight(brushSize);
    strokeCap(ROUND);
    point(mouseX, mouseY);
    
    // Prevent default to avoid any unwanted behavior
    return false;
}

function mouseReleased() {
    // Stop drawing and save the canvas state
    if (isDrawing) {
        isDrawing = false;
        saveCanvasState();
    }
    return false;
}

function mouseOut() {
    // Stop drawing if mouse leaves canvas
    if (isDrawing) {
        isDrawing = false;
        saveCanvasState();
    }
}

function clearCanvas() {
    // Clear the canvas with white background
    background(255);
    saveCanvasState();
}

function saveCanvasState() {
    // Save the current canvas state to history
    if (currentStep < drawingHistory.length - 1) {
        drawingHistory = drawingHistory.slice(0, currentStep + 1);
    }
    
    // Get the canvas image data
    let imageData = canvas.elt.toDataURL();
    drawingHistory.push(imageData);
    currentStep++;
    
    updateUndoRedoButtons();
}

function undoDrawing() {
    if (currentStep > 0) {
        currentStep--;
        loadCanvasState();
    }
}

function redoDrawing() {
    if (currentStep < drawingHistory.length - 1) {
        currentStep++;
        loadCanvasState();
    }
}

function loadCanvasState() {
    let image = new Image();
    image.onload = function() {
        clear();
        image(image, 0, 0, width, height);
    };
    image.src = drawingHistory[currentStep];
    
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    document.getElementById('undo').disabled = currentStep <= 0;
    document.getElementById('redo').disabled = currentStep >= drawingHistory.length - 1;
}