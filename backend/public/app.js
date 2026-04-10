const form = document.getElementById("agent-form");
const output = document.getElementById("output");
const statusBadge = document.getElementById("status");
const submitButton = document.getElementById("submit-btn");

const setStatus = (kind, label) => {
  statusBadge.className = `status ${kind}`;
  statusBadge.textContent = label;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const apiUrl = String(formData.get("apiUrl") || "").trim();
  const input = String(formData.get("input") || "").trim();

  if (!apiUrl || !input) {
    setStatus("error", "Invalid input");
    output.textContent = "Please provide both API endpoint and prompt.";
    return;
  }

  setStatus("loading", "Running");
  submitButton.disabled = true;
  output.textContent = "Waiting for agent response...";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    output.textContent = data.output || "No output returned.";
    setStatus("success", "Success");
  } catch (error) {
    output.textContent = error instanceof Error ? error.message : "Unknown error";
    setStatus("error", "Error");
  } finally {
    submitButton.disabled = false;
  }
});
