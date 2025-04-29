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


// Get the current year
const currentYear = new Date().getFullYear();

// Set the current year into the element with ID 'current-year'
document.getElementById('current-year').textContent = currentYear;