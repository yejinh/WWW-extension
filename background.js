const $signInButton = document.getElementById('signin-button');
let token;

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
  $signInButton.addEventListener('click', signIn);
};

const signIn = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth();
  }
};

const getToken = async() => {
  const userData = await JSON.parse(localStorage.getItem('WWW'));
  token = userData.token;
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
        localStorage.setItem('WWW', JSON.stringify({ token: res.access_token }));
        getToken();
      }
    });

    // get user projects data
    await $.ajax({
      type: 'GET',
      url: `http://localhost:8080/api/projects/${email}`,
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

window.onload = () => {
  initApp();
};

const urls = [
  '*://*.facebook.com/',
  '*://*.twitter.com/',
  '*://*.instagram.com/',
  'newtab',
  'chrome://'
];
let active = {};

// 데이터 서버 전송
const end = async() => {
  if (active.name) {
    const timeDiff = parseInt((Date.now() - active.time) / 1000);
    const domain = active.name;

    getToken();

    $.ajax({
      type: 'PUT',
      url: 'http://localhost:8080/api/projects',
      headers: { Authorization: `Bearer ${token}` },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({ time: timeDiff, domain: domain }),
      success: res => {
        console.log(res);
      }
    });

    console.log(`${timeDiff} seconds at ${domain}`);
    active = {};
  }
};

// 도메인이 변경되는 경우
chrome.tabs.onUpdated.addListener(() => {
  setActive();
});

// 탭이 옮겨지는 경우
chrome.tabs.onActivated.addListener(() => {
  setActive();
});

// 브라우저 focus되지 않는 경우
chrome.windows.onFocusChanged.addListener(window => {
  if (window === -1) {
    end();
  } else {
    setActive();
  }
});

// 아래의 함수 실행
const setActive = async() => {
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
};

// promise return
const getActiveTab = () => {
  return new Promise(resolve => { chrome.tabs.query({ active: true, currentWindow: true },
    activeTab => {
      resolve(activeTab[0]);
    });
  });
};
