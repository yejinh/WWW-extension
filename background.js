const urls = [
  '*://*.facebook.com/',
  '*://*.twitter.com/',
  '*://*.instagram.com/',
  'newtab',
  'chrome://'
];
let active = {};
let domains = [];
let token;
let userId;
let projectId;
let timer;

const firebaseConfig = {
  apiKey: 'AIzaSyC91JeOXfKB_Z_z3wml60Vf9SWITurZyFg',
  authDomain: 'time-tracker-255508.firebaseapp.com',
  databaseURL: 'https://time-tracker-255508.firebaseio.com',
  storageBucket: 'time-tracker-255508.appspot.com'
};

const initApp = () => {
  firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged(user => {
    console.log('initApp', user);
  });

  $('.signin').bind('click', signIn);
};

const signIn = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth();
  }
};

const getToken = () => {
  const userData = JSON.parse(localStorage.getItem('WWW'));

  if (!userData) return;

  token = userData.token;
};

const getUserId = () => {
  const userData = JSON.parse(localStorage.getItem('WWW'));

  if (!userData) return;

  userId = userData.user_id;
};

const getProjectId = () => {
  const userData = JSON.parse(localStorage.getItem('project'));

  if (!userData) return;

  projectId = userData.project_id;
};

const startAuth = async() => {
  try {
    const provider = new firebase.auth.FacebookAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const { user } = result;
    const { email, photoURL } = user;
    const name = user.displayName;

    // login and get token
    await $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/api/auth/authenticate',
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({ email, name, photoURL }),
      success: res => {
        localStorage.setItem('WWW', JSON.stringify({
          token: res.access_token
        }));

        getToken();
      }
    });

    if (!token) return;
    // get user data
    await $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/api/users/',
      headers: { Authorization: `Bearer ${token}` },
      success: res => {
        localStorage.setItem('WWW', JSON.stringify({
          token: token,
          user_id: res.userData._id
        }));

        getUserId();

        if (!userId || !token) return;

        chrome.storage.local.set({ userData: res.userData }, () => {
          if (chrome.runtime.lastError) {
            console.error(`${userData} to ${res}: ${chrome.runtime.lastError.message}`);
          }
        });
      }
    });

    // get logged in user projects
    await $.ajax({
      type: 'GET',
      url: `http://localhost:8080/api/projects/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      success: res => {
        chrome.storage.local.set({ projects: res.projects }, () => {
          if (chrome.runtime.lastError) {
            console.error(`${projects} to ${res}: ${chrome.runtime.lastError.message}`);
          }
        });
      }
    });
  } catch(err) {
    console.log(err);
  }
};

window.onload = initApp;

// 데이터 축적
const end = () => {
  if (active.name) {
    const timeDiff = parseInt((Date.now() - active.time) / 1000);
    const host = active.name;

    if (!domains.length) {
      return domains.push({ [host]: timeDiff });
    }

    const hasBeen = domains.map(domain => {
      if (Object.keys(domain)[0] === host) {
        domain[host] += timeDiff;

        return true;
      }

      return false;
    });

    if (hasBeen.every(been => been === false)) {
      domains.push({ [host]: timeDiff });
    }
  }
};

// 서버 전송
const updateProject = () => {
  const data = domains.slice();
  domains.length = 0;

  domains
  $.ajax({
    type: 'PUT',
    url: `http://localhost:8080/api/projects/${projectId}`,
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data),
    success: res => {
      console.log(res);
    }
  });
};

const repeat = (func, wait) => {
  return function(...args) {
    timer = setInterval(() => {
      console.log('working?');
      func.apply(this, args);
    }, wait);
  };
};

const dataHandler = repeat(() => {
  getToken();
  getProjectId();

  if (!projectId || !token) return;

  updateProject();
}, 15000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'startTracking') {
    dataHandler();
  };

  if (request.message === 'stopTracking') {
    clearInterval(timer);
  }
});

// 도메인이 변경되는 경우
chrome.tabs.onUpdated.addListener(() => {
  setActive();
});

// 탭이 옮겨지는 경우
chrome.tabs.onActivated.addListener(() => {
  setActive();
});

// 탭이 꺼지는 경우?
chrome.tabs.onRemoved.addListener(() => {
  setActive();
});

// 브라우저 focus되지 않는 경우
chrome.windows.onFocusChanged.addListener(window => {
  if (window === -1) {
    end();
    active = {}
  } else {
    setActive();
  }
});

// 아래의 함수 실행
const setActive = async() => {
  try {
    const activeTab = await getActiveTab();

    if (activeTab) {
      let host = new URL(activeTab.url).hostname;
      host = host.replace('www.', '').replace('.com', '');

      if (!urls.some(url => url.includes(host))) {
        if (active.name !== host) {
          end();

          active = { name: host, time: Date.now() };
        }
      }
    }
  } catch(err) {
    console.error(err);
  }
};

// promise return
const getActiveTab = () => {
  return new Promise(resolve => { chrome.tabs.query({ active: true, currentWindow: true },
    activeTab => {
      resolve(activeTab[0]);
    });
  });
};



// localStorage.removeItem('WWW');
// localStorage.removeItem('project');
// localStorage.removeItem('tracking');

// chrome.storage.local.clear(() => {
//   const error = chrome.runtime.lastError;

//   if (error) {
//     console.error(error);
//   }
// });

// $userProfile.remove();
// $projectWrapper.remove();

// $signIn.css({ display: 'block' });
// $signOut.css({ display: 'none' });
// $startButton.css({ display: 'none' });
// $trackingWrapper.css({ display: 'none' });

// firebase.auth().signOut();
