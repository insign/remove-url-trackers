// ==UserScript==
// @name Better LMSYS Chat
// @namespace https://github.com/insign
// @version 202409170820
// @description removes annoying url trackers parameters like utm_*, ref, etc
// @match http*://*
// @author Hélio <open@helio.me>
// @license WTFPL
// @off-downloadURL https://update.greasyfork.org/scripts/489922/Better%20LMSYS%20Chat.user.js
// @off-updateURL https://update.greasyfork.org/scripts/489922/Better%20LMSYS%20Chat.meta.js
// ==/UserScript==

(function() {
  // Parameters to remove from the URL (we can extend this list if needed).
  const paramsToStrip = ['utm_', 'ref']

  /**
   * Checks if a parameter should be removed from the URL.
   * @param {string} param - The parameter name (key=value format).
   * @returns {boolean} - True if the parameter should be preserved, false otherwise.
   */
  function shouldPreserveParam(param) {
    return !paramsToStrip.some(prefix => param.startsWith(prefix))
  }

  /**
   * Cleans the URL by removing the specified parameters.
   * @param {string} url - The original URL.
   * @returns {string} - The cleaned-up URL with unwanted parameters removed.
   */
  function cleanUrl(url) {
    return url.replace(/\?([^#]*)/, (match, searchParams) => {
      const updatedParams = searchParams
        .split('&')
        .filter(shouldPreserveParam) // Retain only non-matching params.
        .join('&')

      return updatedParams ? '?' + updatedParams : ''
    })
  }

  /**
   * Updates the browser's URL by replacing history state if needed.
   */
  function updateUrl() {
    const currentUrl = location.href
    const cleanedUrl = cleanUrl(currentUrl)

    if (currentUrl !== cleanedUrl && window.history.replaceState) {
      window.history.replaceState({}, '', cleanedUrl)
    }
  }

  // Only run if the URL contains parameters.
  if (/[\?&]/.test(location.search)) {
    updateUrl()
  }
})()
