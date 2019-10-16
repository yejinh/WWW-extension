const $signIn = $('.signin');
const $signOut = $('.signout');
const $userProfile = $('.user-profile');
const $projectWrapper = $('.project-wrapper');

// 지속적으로 로그인 된 경우 ?
chrome.storage.local.get('userData', userData => {
  if (!userData) return;

  const { name, profilePhoto } = userData.userData;
  const photo = $(`<img src="${profilePhoto}?height=70&width=70" />`);
  const userName = $(`<span>${name}</span>`);

  $signIn.css({ display: 'none' });
  $signOut.css({ display: 'block' });
  $userProfile.css({ display: 'block' });

  $userProfile.append(userName);
  $userProfile.append(photo);
});

// display projects
chrome.storage.local.get('projects', projects => {
  if (!Object.keys(projects).length) return;

  projects.projects.map(project => {
    const title = $(`<li>${project.title}</li>`);
    console.log('local get', project._id);

    title.bind('click', () => {
      localStorage.setItem('project', JSON.stringify({
        project_id: project._id
      }));
    });

    $projectWrapper.css({ display: 'block' });
    $projectWrapper.append(title);
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

      $signIn.css({ display: 'none' });
      $signOut.css({ display: 'block' });
      $userProfile.css({ display: 'block' });

      $userProfile.append(userName);
      $userProfile.append(photo);
      return;
    }

    const projects = change.newValue;

    projects.map(project => {
      const title = $(`<li>${project.title}</li>`);

      title.bind('click', () => {
        localStorage.setItem('project', JSON.stringify({
          project_id: project._id
        }));
      });
      console.log('onChange', project._id);

      $signIn.css({ display: 'none' });
      $signOut.css({ display: 'block' });

      $projectWrapper.css({ display: 'block' });
      $projectWrapper.append(title);
    });
  }
});

// 로그아웃
$signOut.bind('click', () => {
  localStorage.removeItem('WWW');
  localStorage.removeItem('project');

  chrome.storage.local.clear(() => {
    const error = chrome.runtime.lastError;

    if (error) {
      console.error(error);
    }
  });

  $userProfile.remove();
  $projectWrapper.remove();

  $signIn.css({ display: 'block' });
  $signOut.css({ display: 'none' });


  firebase.auth().signOut();
});




// if (!urls.some(url => url.includes(host))) {
//   if (active.hasOwnProperty(host)) {
//     const timeDiff = parseInt((Date.now() - active[host].time) / 1000);

//     active[host] = {
//       accTime: active[host].accTime + timeDiff,
//       time: Date.now()
//     }
//   } else {
//     active[host] = {
//       accTime: 0,
//       time: Date.now()
//     }
//   }
//   end();
// }
