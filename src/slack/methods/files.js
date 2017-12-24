'use strict'

/**
 * Shares a File to a Channel
 * NB: THIS METHOD REQUIRES A BROWSER TOKEN.
 *
 * @method shareFile
 * @param {Object} slack - The wrapped slack
 * @param {String} options.channelId - The Slack Channel ID like 'C012345'
 * @param {String} options.fileId - The Slack File ID like 'F012345'
 * @return {Object} - A Slack Message object as returned by the API
 */
const shareFile = async function ({ fileId, channelId }) {
  return this._makeAPICall({
    endpoint: 'files.share',
    apiArgs: {
      file: fileId,
      channel: channelId,
    },
  })
}

/**
 * Unshares a File to a Channel
 * NB: THIS METHODS REQUIRES A BROWSER TOKEN.
 *
 * @method unshareFile
 * @param {Object} slack - The wrapped slack
 * @param {String} options.channelId - The Slack Channel ID like 'C012345'
 * @param {String} options.fileId - The Slack File ID like 'F012345'
 * @return {Object} - A Slack Message object as returned by the API
 */
const unshareFile = async function ({ fileId, channelId }) {
  return this._makeAPICall({
    endpoint: 'files.unshare',
    apiArgs: {
      file: fileId,
      channel: channelId,
    },
  })
}

module.exports = {
  shareFile,
  unshareFile,
}
