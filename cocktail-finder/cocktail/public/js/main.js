// Auto-focus the search input on page load
const searchInput = document.querySelector(".search-input");
if (searchInput && !searchInput.value) {
  searchInput.focus();
}
