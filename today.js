var today = new Date();
var options = {  year: 'numeric', month: '2-digit', day: '2-digit' };
var formattedDate = today.toLocaleDateString(undefined, options);
document.getElementById('datePlaceholder').style.color = '#CD7F32';
document.getElementById('datePlaceholder').textContent = "Last Update: " + formattedDate;