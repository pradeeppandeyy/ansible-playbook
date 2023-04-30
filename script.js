const moduleOptions = {
  apt: [
    { label: "Package", id: "name", type: "text" },
    { label: "State", id: "state", type: "select", options: ["present", "absent", "latest"] },
    { label: "Update Cache", id: "update_cache", type: "select", options: ["yes", "no"] },
  ],
  command: [
    { label: "Command", id: "cmd", type: "text" },
  ],
  copy: [
    { label: "Source", id: "src", type: "text" },
    { label: "Destination", id: "dest", type: "text" },
    { label: "Mode", id: "mode", type: "text" },
  ],
  file: [
    { label: "Path", id: "path", type: "text" },
    { label: "State", id: "state", type: "select", options: ["absent", "directory", "file", "touch"] },
    { label: "Mode", id: "mode", type: "text" },
  ],
  git: [
    { label: "Repository", id: "repo", type: "text" },
    { label: "Destination", id: "dest", type: "text" },
    { label: "Version", id: "version", type: "text" },
  ],
  service: [
    { label: "Name", id: "name", type: "text" },
    { label: "State", id: "state", type: "select", options: ["started", "stopped", "restarted", "reloaded"] },
  ],
  shell: [
    { label: "Command", id: "cmd", type: "text" },
  ],
  template: [
    { label: "Source", id: "src", type: "text" },
    { label: "Destination", id: "dest", type: "text" },
    { label: "Mode", id: "mode", type: "text" },
  ],
  unarchive: [
    { label: "Source", id: "src", type: "text" },
    { label: "Destination", id: "dest", type: "text" },
    { label: "Mode", id: "mode", type: "text" },
  ],
  user: [
    { label: "Name", id: "name", type: "text" },
    { label: "State", id: "state", type: "select", options: ["present", "absent"] },
    { label: "Password", id: "password", type: "text" },
  ],
  yum: [
    { label: "Package", id: "name", type: "text" },
    { label: "State", id: "state", type: "select", options: ["present", "absent", "latest"] },
  ],
};


function updateModuleOptions() {
  const selectedModule = document.getElementById("module").value;
  const moduleSpecificOptions = moduleOptions[selectedModule] || [];
  const optionsContainer = document.getElementById("moduleOptions");

  optionsContainer.innerHTML = "";

  moduleSpecificOptions.forEach((option) => {
    const formGroup = document.createElement("div");
    formGroup.className = "mb-3";

    const label = document.createElement("label");
    label.htmlFor = option.id;
    label.textContent = option.label;
    formGroup.appendChild(label);

    if (option.type === "select") {
      const select = document.createElement("select");
      select.className = "form-select";
      select.id = option.id;

      option.options.forEach((opt) => {
        const optionElement = document.createElement("option");
        optionElement.value = opt;
        optionElement.textContent = opt;
        select.appendChild(optionElement);
      });

      formGroup.appendChild(select);
    } else {
      const input = document.createElement("input");
      input.type = option.type;
      input.className = "form-control";
      input.id = option.id;
      formGroup.appendChild(input);
    }

    optionsContainer.appendChild(formGroup);
  });
}

document.getElementById("module").addEventListener("change", updateModuleOptions);

document.getElementById("playbookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const hosts = document.getElementById("hosts").value;
  const module = document.getElementById("module").value;

  const moduleSpecificOptions = moduleOptions[module] || [];
  const args = {};

  moduleSpecificOptions.forEach((option) => {
    const value = document.getElementById(option.id).value;
    if (value) {
      args[option.id] = value;
    }
  });

  const yamlPlaybook = `---
- name: ${name}
  hosts: ${hosts}
  tasks:
    - name: Task 1
      ${module}:
${Object.entries(args)
  .map(([key, value]) => `        ${key}: ${value}`)
  .join("\n")}
  `;

  document.getElementById("output").innerText = yamlPlaybook;
});
