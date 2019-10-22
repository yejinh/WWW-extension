const $signOut = $('.signout');
const $login = $('.login');
const $header = $('.header');
const $userProfile = $('.user-profile');
const $projectWrapper = $('.project-wrapper');
const $trackingWrapper = $('.tracking-wrapper');
const $trackingTitle = $('.traking-title');
const $startButton = $('.start-button');

const isTracking = () => {
  const projectData = JSON.parse(localStorage.getItem('tracking'));

  if (!projectData) return;

  return projectData;
};

// 지속적으로 로그인 된 경우 ?
chrome.storage.local.get('userData', userData => {
  if (!userData) return;

  const { name, profilePhoto } = userData.userData;
  const photo = $(`<img src="${profilePhoto}?height=70&width=70" />`);
  const userName = $(`<span>${name}</span>`);

  $login.css({ display: 'none' });
  $header.css({ display: 'flex' });
  $startButton.css({ display: 'block' });

  $userProfile.append(userName);
  $userProfile.append(photo);
});

// display projects
chrome.storage.local.get('projects', projects => {
  const projectData = isTracking();

  if (projectData && projectData.isTracking) {
    $startButton.css({ display: 'none' });
    $projectWrapper.css({ display: 'none' });
    $trackingWrapper.css({ display: 'block' });
    $trackingTitle.text(`${projectData.title}`);
    return;
  };

  if (!Object.keys(projects).length) return;

  projects.projects.map(project => {
    const now = new Date().toISOString();

    if (project.created_at > now) return;

    const title = $(`<li>${project.title}</li>`);

    title.bind('click', () => {
      startTracking(project._id, project.title);
      $startButton.prop('disabled', false).css({ backgroundColor: '#1C768F', color: '#FFFFFF' });
    });

    $projectWrapper.css({ display: 'block' });
    $projectWrapper.append(title);
  });

  $('ul li').click(function() {
    $('ul li').removeClass('clicked');
    $(this).addClass('clicked');
  });
});

// 바로 로그인 한 경우 유저 정보와 프로젝트
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let newData in changes) {
    const change = changes[newData];

    if (change.newValue.hasOwnProperty('name')) {
      const user = change.newValue;
      const { name, profilePhoto } = user;

      const photo = $(`<img src="${profilePhoto}?height=70&width=70" />`);
      const userName = $(`<span>${name}</span>`);

      $login.css({ display: 'none' });
      $header.css({ display: 'flex' });
      $startButton.css({ display: 'block' });

      $userProfile.append(userName);
      $userProfile.append(photo);
      return;
    }

    const projects = change.newValue;
    const projectData = isTracking();

    if (projectData && projectData.isTracking) {
      $startButton.css({ display: 'none' });
      $projectWrapper.css({ display: 'none' });
      $trackingWrapper.css({ display: 'block' });
      $trackingTitle.text(projectData.title);
      return;
    };

    projects.map(project => {
      const now = new Date().toISOString();

      if (project.created_at > now) return;

      const title = $(`<li>${project.title}</li>`);

      title.bind('click', () => {
        startTracking(project._id, project.title);
        $startButton.prop('disabled', false).css({ backgroundColor: '#1C768F', color: '#FFFFFF' });
      });

      $signOut.css({ display: 'block' });
      $projectWrapper.css({ display: 'block' });
      $projectWrapper.append(title);
    });

    $('ul li').click(function() {
      $('ul li').removeClass('clicked');
      $(this).addClass('clicked');
    });
  }
});

// 트래킹 시작
const startTracking = (projectId, title) => {
  $startButton.bind('click', () => {
    chrome.runtime.sendMessage({ message: 'startTracking' });

    localStorage.setItem('project', JSON.stringify({
      project_id: projectId
    }));

    $startButton.css({ display: 'none' });
    $projectWrapper.css({ display: 'none' });
    $trackingWrapper.css({ display: 'block' });
    $trackingTitle.text(title);

    localStorage.setItem('tracking', JSON.stringify({
      isTracking: true,
      title: title
    }));
  });
};

// 로그아웃
$signOut.bind('click', () => {
  chrome.runtime.sendMessage({ message: 'stopTracking' });

  localStorage.removeItem('WWW');
  localStorage.removeItem('project');
  localStorage.removeItem('tracking');

  chrome.storage.local.clear(() => {
    const error = chrome.runtime.lastError;

    if (error) {
      console.error(error);
    }
  });

  $userProfile.remove();
  $projectWrapper.remove();

  $login.css({ display: 'block' });
  $header.css({ display: 'none' });
  $startButton.css({ display: 'none' });
  $trackingWrapper.css({ display: 'none' });

  firebase.auth().signOut();
});
