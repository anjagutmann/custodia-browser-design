// JavaScript
function onNoiseButtonClick() {
  // Hier könnten Sie weitere Aktionen hinzufügen, falls nötig
  document.body.classList.toggle('noise-active');
}

// JavaScript
function toggleNoiseMode() {
  isNoiseModeActive = !isNoiseModeActive;
  document.body.classList.toggle('noise-active', isNoiseModeActive);
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
    
  //   const container = document.getElementById('frequently-used-sites');
  //   container.addEventListener('dragover', e => {
  //     e.preventDefault();
  //     const draggable = document.querySelector('.dragging');
  //     const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
  //     if (afterElement == null) {
  //       container.appendChild(draggable);
  //     } else {
  //       container.insertBefore(draggable, afterElement);
  //     }
  //   });
  // });
  
  // function getDragAfterElement(container, x, y) {
  //   const draggableElements = [...container.querySelectorAll('.website:not(.dragging)')];
  
  //   return draggableElements.reduce((closest, child) => {
  //     const box = child.getBoundingClientRect();
  //     const offset = y - box.top - box.height / 2;
  //     if (offset < 0 && offset > closest.offset) {
  //       return { offset: offset, element: child };
  //     } else {
  //       return closest;
  //     }
  //   }, { offset: Number.NEGATIVE_INFINITY }).element;
  // }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Zusätzliche Logik zur Anzeige des Inhalts des ausgewählten Tabs
    });
  });
  
  document.querySelector('.add-tab').addEventListener('click', function() {
    // Logik für das Hinzufügen eines neuen Tabs
  });
});
