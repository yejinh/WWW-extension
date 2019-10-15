const $body = document.querySelector('body');
const $signIn = document.getElementById('signin-button');
const $signOut = document.getElementById('signout-button');

chrome.storage.local.get('projects', projects => {
  const projectsWrapper = document.createElement('div');

  projects.projects.map(project => {
    const span = document.createElement('span');
    const text = document.createTextNode(project.title);

    $signIn.style.display = 'none';
    $signOut.style.display = 'block';
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
      $signOut.style.display = 'block';

      span.appendChild(text);
      projectsWrapper.appendChild(span);
    });

    $body.appendChild(projectsWrapper);
  }
});

$signOut.addEventListener('click', () => {
  localStorage.removeItem('WWW');

  chrome.storage.local.clear(() => {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });

  const $projectsWrapper = document.querySelector('div');

  $body.removeChild($projectsWrapper);
  $signIn.style.display = 'block';
  $signOut.style.display = 'none';

  firebase.auth().signOut();
});
