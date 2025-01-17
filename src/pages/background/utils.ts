export const senderIsPopup = (sender: chrome.runtime.MessageSender) => {
  const origin = "chrome-extension://" + chrome.runtime.id;
  const popupPath = origin + "/src/pages/popup/index.html";
  return sender.origin === origin && sender.url === popupPath;
};

export const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};

export const getCurrentTab = (): Promise<chrome.tabs.Tab> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
};

export const getCurrentDomain = async () => {
  const currentTab = await getCurrentTab();
  console.log("Current tab: ", currentTab);
  return currentTab ? new URL(currentTab.url!) : null;
};

export const obfuscateString = (inputString: string) => {
  const prefixLength = 12;
  const suffixLength = 8;

  if (inputString.length <= prefixLength + suffixLength) {
    return inputString;
  }

  const prefix = inputString.slice(0, prefixLength);
  const suffix = inputString.slice(-suffixLength);

  return `${prefix}...${suffix}`;
};

export const removeSlash = (site:string) => {
  return site.replace(/\/$/, "");
};

export const hasWhiteSpace = (s: string) => {
  return s.indexOf(' ') >= 0;
}

export const removeWhiteSpace = (s: string, replace="") => {
  return s.replace(/\s/g, replace);
}
