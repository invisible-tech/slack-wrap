'use strict'

/**
 * Shares a File to a Channel
 *
 * @method shareFile
 * @param {Object} slack - The wrapped slack
 * @param {String} options.channelId - The Slack Channel ID like 'C012345'
 * @param {String} options.fileId - The Slack File ID like 'F012345'
 * @return {Object} - A Slack Message object as returned by the API
 */
const shareFile = slack =>
  async ({ fileId, channelId }) =>
    slack._makeAPICall({
      endpoint: 'files.share',
      apiArgs: {
        file: fileId,
        channel: channelId,
      },
    })

/**
 * Unshares a File to a Channel
 *
 * @method unshareFile
 * @param {Object} slack - The wrapped slack
 * @param {String} options.channelId - The Slack Channel ID like 'C012345'
 * @param {String} options.fileId - The Slack File ID like 'F012345'
 * @return {Object} - A Slack Message object as returned by the API
 */
const unshareFile = slack =>
  async ({ fileId, channelId }) =>
    slack._makeAPICall({
      endpoint: 'files.unshare',
      apiArgs: {
        file: fileId,
        channel: channelId,
      },
    })

module.exports = {
  shareFile,
  unshareFile,
}
