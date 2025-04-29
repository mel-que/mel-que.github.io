// MAKE NAVBAR MENU COLLAPSE AFTER CLICKING A MENU OPTION //
// Get all nav links inside the navbar
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

// Get the collapse element (the menu)
const navbarCollapse = document.getElementById('navbarNav');

// Add event listener for each link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Close the navbar by collapsing it
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarCollapse.classList.contains('show')) {
      navbarToggler.click(); // This simulates a click to collapse the navbar
    }
  });
});





// This will hold the data from the JSON file
let projects = [];

// Fetch the JSON data from the 'projects.json' file
fetch('projects.json')
  .then(response => response.json())
  .then(data => {
    projects = data; // Store the JSON data in the 'projects' variable
    // Initially display all cards (web, app, and design projects)
    createCollapseSections();
  })
  .catch(error => console.error('Error loading JSON:', error));

function createCollapseSections() {
    const collapseSections = document.getElementById("collapse-sections");
    const projectTypes = [...new Set(projects.map(p => p.projectType))];
  
    projectTypes.forEach(projectType => {
      const formattedProjectType = projectType.replace(/\s+/g, '-');
      const sectionId = `collapse-${formattedProjectType}`;
      const subTypes = [...new Set(projects
        .filter(p => p.projectType === projectType && p.subType)
        .map(p => p.subType))];
  
      let innerHTML = '';
  
      if (subTypes.length > 0) {
        subTypes.forEach(subType => {
          const formattedSubType = subType.replace(/\s+/g, '-');
          innerHTML += `
          <div class="d-grid my-2 col-12 mx-auto">
            <button class="btn btn-custom-sub dropdown-toggle" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapse-${formattedProjectType}-${formattedSubType}"
                    aria-expanded="false" aria-controls="collapse-${formattedProjectType}-${formattedSubType}">
              ${subType}
            </button>
            <div class="collapse" id="collapse-${formattedProjectType}-${formattedSubType}">
              ${generateCards(projectType, subType)}
            </div>
          </div>
          `;
        });
      }
  
      // Add cards that do not have a subType
      innerHTML += generateCards(projectType, null);
  
      const sectionHTML = `
        <div class="row">
          <div class="d-grid mb-4 col-12 mx-auto">
            <button class="btn btn-custom-cat btn-lg active dropdown-toggle" type="button"
                    data-bs-toggle="collapse" data-bs-target="#${sectionId}"
                    aria-expanded="false" aria-controls="${sectionId}">
              ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Projects
            </button>
            <div class="collapse" id="${sectionId}">
              ${innerHTML}
            </div>
          </div>
        </div>
      `;
      collapseSections.innerHTML += sectionHTML;
    });
  }
  
  function generateCards(projectType, subType = null) {
    let cardsHTML = '';
  
    const filtered = projects.filter(project => 
      project.projectType === projectType && 
      (subType ? project.subType === subType : !project.subType)
    );
  
    filtered.forEach(project => {
      cardsHTML += `
        <div class="card mb-3" style="cursor: pointer;"
            data-bs-toggle="modal"
            data-bs-target="#projectModal"
            data-title="${project.title}"
            data-image="${project.imageSrc}"
            data-image2="${project.imageSrc2}"
            data-image3="${project.imageSrc3}"
            data-description="${project.context}">
          <div class="d-flex">
            <img src="${project.imageSrc}" class="card-img-left my-auto" alt="${project.title}">
            <div class="card-body">
              <h3 class="card-text projectTitle">${project.title}</h3>
              <p class="card-text projectDetails"><strong>Context:</strong> ${project.context}</p>
              ${project.purpose ? `<p class="card-text projectDetails"><strong>Purpose:</strong> ${project.purpose}</p>` : ''}
              <p class="card-text projectDetails"><strong>Application:</strong> ${project.application}</p>
            </div>
          </div>
        </div>
      `;
    });
  
    return cardsHTML;
  }

  // Event listener for opening the modal
document.addEventListener('DOMContentLoaded', () => {
  const projectModal = document.getElementById('projectModal');
  
  projectModal.addEventListener('show.bs.modal', (event) => {
    // Get the clicked card's data attributes
    const card = event.relatedTarget; // The card that triggered the modal
    const title = card.getAttribute('data-title');
    const imageSrc1 = card.getAttribute('data-image');
    const imageSrc2 = card.getAttribute('data-image2'); // Additional image 2
    const imageSrc3 = card.getAttribute('data-image3'); // Additional image 3
    //const description = card.getAttribute('data-description');

    // Update modal content
    document.getElementById('projectModalLabel').textContent = title; // Set modal title
    //document.getElementById('modalImage').src = imageSrc; // Set modal image source
    //document.getElementById('modalDescription').textContent = description; // Set modal description
  
    // Get the carousel inner container where images will go
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = '';  // Clear any existing images
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    // Helper function to check if image exists
    const checkImageExists = (imageUrl, callback) => {
      const img = new Image();
      img.onload = () => callback(true);  // Image loaded successfully, it exists
      img.onerror = () => callback(false); // Image failed to load, it does not exist
      img.src = imageUrl;
    };

    // Helper function to create carousel items
    const createCarouselItem = (imageSrc, isActive) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('carousel-item');
      if (isActive) {
        itemDiv.classList.add('active');
      }
      const image = document.createElement('img');
      image.src = imageSrc;
      image.classList.add('d-block', 'w-100', 'img-fluid');
      itemDiv.appendChild(image);
      return itemDiv;
    };

    // Add the primary image (image-1.png) to the carousel
    checkImageExists(imageSrc1, (exists) => {
      if (exists) {
        const primaryImageItem = createCarouselItem(imageSrc1, true);  // Make this image active
        carouselInner.appendChild(primaryImageItem);
      }
    });

    // Add additional images if they exist
    let imagesCount = 0;
    [imageSrc2, imageSrc3].forEach((imageSrc) => {
      if (imageSrc) {
        checkImageExists(imageSrc, (exists) => {
          if (exists) {
            const imageItem = createCarouselItem(imageSrc, false); // Don't make these images active
            carouselInner.appendChild(imageItem);
            imagesCount++;
            
          }
        });
      }
    });

    setTimeout(() => {
      if (imagesCount > 0) {
        prevButton.style.display = 'block';  // Show previous button
        nextButton.style.display = 'block';  // Show next button
      } else {
        prevButton.style.display = 'none';  // Hide previous button
        nextButton.style.display = 'none';  // Hide next button
      }
    }, 100);  // Delay to allow the images to load and get counted

  });

});



  // CURRENT YEAR FOR COPYRIGHT FOOTER //
// Get the current year
const currentYear = new Date().getFullYear();

// Set the current year into the element with ID 'current-year'
document.getElementById('current-year').textContent = currentYear;