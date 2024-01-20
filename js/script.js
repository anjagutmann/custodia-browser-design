// toggleContainer.js

// Function to toggle the container class
function toggleContainer() {
  var container = document.getElementById('container');
  var vis = document.getElementById('vis');

  container.classList.toggle('container-fluid', document.getElementById('containerToggle').checked);
  vis.classList.toggle('container-fluid', document.getElementById('containerToggle').checked);
}

// Attach the toggleContainer function to the change event of the toggle switch
document.getElementById('containerToggle').addEventListener('change', toggleContainer);



var width = 1200,
  height = 1000,
  padding = 11, // separation between same-color nodes
  clusterPadding = 20, // separation between different-color nodes
  minRadius = 25;

var div = d3.select("#vis").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var color = d3.scale.ordinal().range(["#4ECDC4", "#FF6B6B", "#C7F464"]);

d3.text(
  "https://gist.githubusercontent.com/kvyb/4a185581222968f0d8f3ec18284c0715/raw/b01a8aec8c510357b277835d42648ed38b793998/outcomperc.csv",
  function(error, text) {
    if (error) throw error;
    var colNames = "text,size,group,perc\n" + text;
    var data = d3.csv.parse(colNames);

    data.forEach(function(d) {
      d.size = +d.size;
    });

    //unique cluster/group id's
    var cs = [];
    data.forEach(function(d) {
      if (!cs.contains(d.group)) {
        cs.push(d.group);
      }
    });

    var n = data.length, // total number of nodes
      m = cs.length; // number of distinct clusters

    //create clusters and nodes
    var clusters = new Array(m);
    var nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push(create_nodes(data, i));
    }
    

    var force = d3.layout
      .force()
      .nodes(nodes)
      .size([width, height])
      .gravity(0.03)
      .charge(0)
      .on("tick", tick)
      .start();

    var svg = d3
      .select("#vis")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("g")
        .on("mouseover", function(d) {
            div.transition()		
                .duration(200)		
                .style("opacity", .9)
            div	.html('<div class="container text-center">'+"<img class='candidate' src=" + "https://raw.githubusercontent.com/kvyb/DataVis/master/HTicons/"+d.clusternumber+".png"+">"+ '</div><p class="tooltiptext">I said "'+d.text+' " '+d.wordcount+" times,<br> which amounts to "+ (Math.round(d.perc * 100) / 100)+"%<br> of all words I used<br> in my speeches in 2016</p>")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
            })			
        .on("mouseout", function(d) {		
            div .transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
    node
      .append("circle")
      .on("mouseover", function(d) {  d3.select(this).attr("r", function(d) {
        return d.radius+5;
      }).style("stroke-width", 5).style("stroke", function(d){return d3.rgb(color(d.cluster)).darker(0.7);})})
      .on("mouseout", function(d) {  d3.select(this).attr("r", function(d) {
        return d.radius;}).style("stroke-width", 0)})
      .style("fill", function(d) {
        return color(d.cluster);
      })
      .style("stroke", function(d) {
        return color(d.cluster);
      })
      .attr("r", function(d) {
        return d.radius;
      })
    node
      .append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("background-color", function(d) {
        return color(d.cluster)})
      .text(function(d) {
        //return d.text.substring(0, d.radius / 3);
        return d.text
      })
    //make rect to cover text below when text bigger than circle
  /*     .call(getTextBox);
   node
      .insert("rect","text")
      .attr("x", function(d){return d.bbox.x})
    .attr("y", function(d){return d.bbox.y})
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("width", function(d){return d.bbox.width})
    .attr("height", function(d){return d.bbox.height+1})
    .style("fill", function(d) {return color(d.cluster)});
    
    function getTextBox(selection) {
    selection.each(function(d) { d.bbox = this.getBBox(); })
} */

    function create_nodes(data, node_counter) {
      var i = cs.indexOf(data[node_counter].group),
        r = Math.sqrt((i + 1) / m * -Math.log()) * 1,
        d = {
          perc: data[node_counter].perc,
          cluster: i,
          clusternumber: data[node_counter].group,
          wordcount: data[node_counter].size,
          radius: data[node_counter].perc*6+minRadius, 
          text: data[node_counter].text,
          x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        };
      if (!clusters[i] || r > clusters[i].radius) clusters[i] = d;
      return d;
    }

    function tick(e) {
      node
        .each(cluster(6* e.alpha * e.alpha))
        .each(collide(0.09))
        .attr("transform", function(d) {
          var k = "translate(" + d.x + "," + d.y + ")";
          return k;
        });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + minRadius + Math.min(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && quad.point !== d) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r =
                d.radius +
                quad.point.radius +
                (d.cluster === quad.point.cluster ? padding : clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
  }
);

Array.prototype.contains = function(v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

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

document.addEventListener('DOMContentLoaded', function() {
  var searchIcon = document.getElementById('search-button'); // Angenommen, das ist Ihr Such-Icon
  var blurBackground = document.createElement('div');
  blurBackground.id = 'blur-background';
  blurBackground.className = 'blur-background';
  document.body.appendChild(blurBackground);

  searchIcon.addEventListener('mouseenter', function() {
    blurBackground.classList.add('blur-active');
  });

  searchIcon.addEventListener('mouseleave', function() {
    blurBackground.classList.remove('blur-active');
  });
});


