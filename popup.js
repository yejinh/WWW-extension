const $body = document.querySelector('body');

chrome.storage.local.get('projects', userData => {
  const projects = userData.projects;
  // console.log(projects);
  projects.map(project => {
    const span = document.createElement('span');
    const text = document.createTextNode(project.title);

    span.appendChild(text);
    $body.appendChild(span);
  });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var project in changes) {
    const projects = changes[project];

    projects.map(project => {
      const span = document.createElement('span');
      const text = document.createTextNode(project.newValue.title);

      span.appendChild(text);
      $body.appendChild(span);
    });
    console.log(JSON.parse(storageChange.newValue));
  }
});
