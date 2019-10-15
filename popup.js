const $body = document.querySelector('body');
const $signIn = document.getElementById('signin-button');

chrome.storage.local.get('projects', projects => {
  const projectsWrapper = document.createElement('div');

  projects.projects.map(project => {
    const span = document.createElement('span');
    const text = document.createTextNode(project.title);

    $signIn.style.display = 'none';
    span.appendChild(text);
    projectsWrapper.appendChild(span);
  });

  $body.appendChild(projectsWrapper);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let newProjects in changes) {
    const change = changes[newProjects];
    const projects = change.newValue;

    const projectsWrapper = document.createElement('div');

    projects.map(project => {
      const span = document.createElement('span');
      const text = document.createTextNode(project.title);

      $signIn.style.display = 'none';
      span.appendChild(text);
      projectsWrapper.appendChild(span);
    });

    $body.appendChild(projectsWrapper);
    // console.log(JSON.parse(storageChange.newValue));
  }
});


// chrome.storage.local.clear(function() {
//   const error = chrome.runtime.lastError;
//   if (error) {
//     console.error(error);
//   }
// });
