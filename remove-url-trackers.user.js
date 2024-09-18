// ==UserScript==
// @name Remove URL trackers
// @namespace https://github.com/insign
// @version 202409172103
// @description removes annoying url trackers parameters like utm_*, ref, etc
// @match *://*/*
// @author Hélio <open@helio.me>
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/508850/Remove%20URL%20trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/508850/Remove%20URL%20trackers.user.js
// ==/UserScript==

(function() {
  // Parameters (that start with these prefixes) to strip from the URL.
  const paramsToStrip = ['utm_', 'ref', 'gclid', 'gclsrc', 'gs_', 'ga_', '_ga', '_gaq', '__utm', 'fbclid', 'mc_', '_cid', 'epik', 'context']

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
