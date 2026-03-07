// Delete confirmation
function confirmDelete() {
  return confirm("Are you sure you want to delete this post? This cannot be undone.");
}

// Character counter for textareas
const textarea = document.getElementById("content");
const charCount = document.getElementById("charCount");

if (textarea && charCount) {
  const update = () => {
    const len = textarea.value.length;
    charCount.textContent = `${len} character${len !== 1 ? "s" : ""}`;
  };
  textarea.addEventListener("input", update);
  update();
}
