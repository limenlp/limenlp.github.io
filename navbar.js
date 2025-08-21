// Navigation bar content
const navbarHTML = `
<!--Navigation bar-->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"> 
  <!--  style="background-color: #e5e5ee; -->
  <div class="container">
    <a class="navbar-brand active" href="https://jyzhao.net/index.html" style="color:rgb(198, 35, 38)">Home
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
      aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" href="https://jyzhao.net/index.html" style="color:rgb(255,199,44)" >Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="index.html" style="color:rgb(255,199,44)" >Lab</a>
          </li>
        <li class="nav-item">
          <a class="nav-link" href="papers.html" style="color:rgb(255,199,44)" > Papers </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://jyzhao.net/teaching.html" style="color:rgb(255,199,44)">Teaching</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;

// Function to insert navigation bar
function insertNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    placeholder.innerHTML = navbarHTML;
  }
}

// Insert navbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertNavbar);
} else {
  insertNavbar();
}
