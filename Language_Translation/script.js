const inputText = document.getElementById('input');
const sourceMenu = document.getElementById('source-menu');
const targetMenu = document.getElementById('target-menu');
const sourceLangToggle = document.getElementById('source-lang');
const targetLangToggle = document.getElementById('target-lang');
const sourceLangText = document.getElementById('source-lang-text');
const targetLangText = document.getElementById('target-lang-text');
const translateBtn = document.getElementById('translate-btn');
const outputDiv = document.getElementById('output');

let sourceLanguage = 'auto';
let targetLanguage = 'es';

// Toggle dropdown menus
const toggleDropdown = (toggle, menu) => {
  menu.classList.toggle('show');
  toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });
  window.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
};

toggleDropdown(sourceLangToggle, sourceMenu);
toggleDropdown(targetLangToggle, targetMenu);

// Select language from dropdown
const selectLanguage = (menu, lang, langText) => {
  const menuItems = menu.querySelectorAll('li');
  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const selectedLang = item.dataset.lang;
      if (menu === sourceMenu) {
        sourceLanguage = selectedLang;
        sourceLangText.textContent = item.textContent;
      } else {
        targetLanguage = selectedLang;
        targetLangText.textContent = item.textContent;
      }
      menu.classList.remove('show');
    });
  });
};

selectLanguage(sourceMenu, sourceLanguage, sourceLangText);
selectLanguage(targetMenu, targetLanguage, targetLangText);

// Translate text
const translateText = async () => {
  const inputValue = inputText.value.trim();
  if (inputValue) {
    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': '53ecade368mshdec871689e00e33p176565jsn65c9361aa10d',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      body: new URLSearchParams({
        q: inputValue,
        target: targetLanguage,
        source: sourceLanguage === 'auto' ? '' : sourceLanguage
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const translatedText = result.data.translations[0].translatedText;
      outputDiv.textContent = translatedText;
    } catch (error) {
      console.error(error);
      outputDiv.textContent = 'Error occurred during translation';
    }
  } else {
    outputDiv.textContent = 'Please enter text to translate';
  }
};

// Detect source language
const detectLanguage = async (text) => {
  const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': '53ecade368mshdec871689e00e33p176565jsn65c9361aa10d',
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    body: new URLSearchParams({ q: text })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const detectedLanguage = result.data.detections[0][0].language;
    return detectedLanguage;
  } catch (error) {
    console.error(error);
    return 'en'; // Default to English if detection fails
  }
};

translateBtn.addEventListener('click', async () => {
  const inputValue = inputText.value.trim();
  if (inputValue) {
    if (sourceLanguage === 'auto') {
      const detectedLanguage = await detectLanguage(inputValue);
      sourceLanguage = detectedLanguage;
      sourceLangText.textContent = detectedLanguage.toUpperCase();
    }
    translateText();
  } else {
    outputDiv.textContent = 'Please enter text to translate';
  }
});