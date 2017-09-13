'use strict'

const fs = require('fs')
const moment = require('moment')
const path = require('path')
const request = require('request-promise-native')

const {
  FILETYPE_SPACE,
  PRETTY_TYPE_POST,
} = require('~/src/slack/constants')

const { basename } = path

const DL_FILE_DIR = `${__dirname}/../../tmp`

/**
 * Saves a File from Slack to the local file system. The file must have been posted
 *   in the Slack Team aassociated with the slack provided, or else
 *   the file will not be accessible.
 *
 * @method downloadFile
 * @param {Object} slack - The wrapped slack
 * @param {String} uri - The uri of the file, provided as file.url_private in the event object
 * @return {String} - the path to the file
 */
const downloadFile = slack =>
  async uri => {
    // Needed or else you can't GET the file
    const headers = {
      Authorization: `Bearer ${slack.getAccessToken()}`,
    }

    const res = await request({ uri, headers, encoding: null })
    const buffer = Buffer.from(res)
    const subDir = path.join(DL_FILE_DIR, moment().format('YYYYMMDDkkmmssSSS'))
    await fs.mkdirSync(subDir)

    const filePath = path.join(subDir, basename(uri))

    // TODO: think about just returning the buffer instead of writing to disk
    fs.writeFileSync(filePath, buffer)
    return filePath
  }

/**
 * Uploads a file to Slack and shares with the given Channels
 *
 * @method uploadFileFromFilePath
 * @param {Object} slack - The wrapped slack
 * @param {String} options.filePath - The path to the file in the local filesystem
 * @param {String} options.channels - a comma separated string of Channel IDs, like
 *   C0123455,C0ABCDEF,C0BADFADF
 * @param {String} options.title - Optional: a title for the file (defaults to the filename)
 * @param {String} options.post - If true, applies the extra fields for uploading a Slack Post
 * @return {Promise<Object>} - The promise to upload the file, which will return a
 *   result from Slack
 */
const uploadFileFromFilePath = slack =>
  async ({ filePath, channels = '', title = false, post = false }) => {
    const filename = basename(filePath)
    const opts = {
      file: {
        value: fs.readFileSync(filePath),
        options: { filename },
      },
      filename,
      title: title || filename,
      channels,
    }

    if (post) {
      Object.assign(opts, {
        filetype: FILETYPE_SPACE,
        pretty_type: PRETTY_TYPE_POST,
      })
    }

    return slack.files.upload(Object.assign({}, opts, { filename }))
  }

module.exports = {
  downloadFile,
  uploadFileFromFilePath,
}
