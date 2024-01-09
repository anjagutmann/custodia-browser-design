// Zustand des Noise-Modus
var isNoiseModeActive = false;

// Referenz zum Body-Element und zum potenziellen Border-Element
var body = document.body;
var border = document.createElement('div');
border.className = 'viewport-border';
body.appendChild(border);

function simulateDataPoisoning() {
    // Verhindert, dass die Animation abgespielt wird, wenn der Noise-Modus aktiv ist
    if (isNoiseModeActive) return;
  
    // Kreis-Animation
    var circle = document.getElementById('growing-circle');
    var scale = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) / 30;
    circle.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
    circle.style.opacity = '1';
  
    // Beginnt den Prozess, den Kreis zu verbergen, ohne zu schrumpfen
    setTimeout(function() {
      circle.style.opacity = '0'; // Kreis wird transparent
      setTimeout(function() {
        circle.style.transform = 'translate(-50%, -50%) scale(0)'; // Setzt den Kreis zurück, ohne sichtbare Animation
      }, 1500); // Wartet auf das Ende der Opazitätstransition
    }, 1500); // Wartezeit, bis die Opazitätstransition beginnt
  }
  

function toggleNoiseMode() {
  if (isNoiseModeActive) {
    // Schalte den Noise-Modus aus
    border.style.display = 'none';
  } else {
    // Schalte den Noise-Modus ein
    border.style.display = 'block';
  }
  isNoiseModeActive = !isNoiseModeActive;
}

// Kombinierte Funktion zum Umschalten des Noise-Modus und zur Simulation von Data Poisoning
function onNoiseButtonClick() {
  simulateDataPoisoning();
  toggleNoiseMode();
}

// Funktion zum Hinzufügen von Klick-Event-Listeners zu jedem Tab
function setupTabs() {
    var tabs = document.querySelectorAll('.tab-container .tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        // Entfernt die aktive Klasse von allen Tabs
        tabs.forEach(function(tab) {
          tab.classList.remove('active');
        });
        // Fügt die aktive Klasse zum angeklickten Tab hinzu
        tab.classList.add('active');
      });
    });
  }

  document.addEventListener('click', function(e) {
    const modeButton = document.querySelector('.mode-button');
    const additionalModes = document.querySelector('.additional-modes');
    const isClickInside = modeButton.contains(e.target);
  
    if (!isClickInside && additionalModes.style.display === 'flex') {
      additionalModes.style.display = 'none';
    }
  });
  