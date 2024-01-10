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

// function onNoiseButtonClick() {
//     // Annahme, dass 'top-bar' die Klasse ist, die Ihre Topbar identifiziert
//     const topBar = document.querySelector('.top-bar');
//     topBar.classList.toggle('animate-line');
// }

/// Entfernen Sie die erste Definition von onNoiseButtonClick
function onNoiseButtonClick() {
    simulateDataPoisoning();
    toggleNoiseMode();
    
    // Toggle der Klasse für die Animation der Linie
    const topBar = document.querySelector('.top-bar');
    topBar.classList.toggle('animate-line');
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
    const modeButton = document.querySelector('.mode-buttons');
    const additionalModes = document.querySelector('.additional-modes');
    const isClickInside = modeButton.contains(e.target);
  
    if (!isClickInside && additionalModes.style.display === 'flex') {
      additionalModes.style.display = 'none';
    }
  });



document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.additional-modes .mode').forEach(mode => {
        mode.addEventListener('click', function() {
            // Aktuellen und neuen Modus finden
            const currentMode = document.querySelector('.current-mode');
            const newModeIcon = mode.querySelector('span').textContent;
            const newModeText = mode.querySelector('div').textContent;
  
            // Aktualisiere den aktuellen Modus
            currentMode.querySelector('span').textContent = newModeIcon;
            currentMode.querySelector('div').textContent = newModeText;
  
            // Aktualisiere die Sichtbarkeit der Modi in den zusätzlichen Modi
            updateAdditionalModesVisibility(newModeIcon);
  
            // Schließe die zusätzlichen Modi
            document.querySelector('.additional-modes').style.display = 'none';
        });
    });
  
    // Event-Listener, um die zusätzlichen Modi anzuzeigen, wenn über den aktuellen Modus gehovert wird
    document.querySelector('.current-mode').addEventListener('mouseover', () => {
        document.querySelector('.additional-modes').style.display = 'flex';
    });
  });
  
  function updateAdditionalModesVisibility(currentModeIcon) {
    document.querySelectorAll('.additional-modes .mode').forEach(mode => {
        if (mode.querySelector('span').textContent === currentModeIcon) {
            mode.style.display = 'none'; // Verstecke den aktuellen Modus
        } else {
            mode.style.display = 'flex'; // Zeige andere Modi
        }
    });
  } 


  document.addEventListener('DOMContentLoaded', (event) => {
    const websites = document.querySelectorAll('.website');
    
    websites.forEach(website => {
      website.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
          e.target.classList.add('dragging');
        }, 0);
      });
      
      website.addEventListener('dragend', e => {
        e.target.classList.remove('dragging');
        const x = e.clientX - e.target.offsetWidth / 2;
        const y = e.clientY - e.target.offsetHeight / 2;
        e.target.style.position = 'absolute';
        e.target.style.left = `${x}px`;
        e.target.style.top = `${y}px`;
      });
    });
    
    const container = document.getElementById('frequently-used-sites');
    container.addEventListener('dragover', e => {
      e.preventDefault();
      const draggable = document.querySelector('.dragging');
      const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
  
  function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.website:not(.dragging)')];
  
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
