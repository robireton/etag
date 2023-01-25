import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import { Stats } from 'node:fs'

const stattag = stat => `"${stat.size.toString(16)}-${stat.mtime.getTime().toString(16)}"`
const entitytag = entity => `"${((typeof entity === 'string') ? Buffer.byteLength(entity, 'utf8') : entity.length).toString(16)}-${(entity.length === 0) ? '2jmj7l5rSw0yVb/vlWAYkK/YBwk' : crypto.createHash('sha1').update(entity, 'utf8').digest('base64').substring(0, 27)}"`

/**
 * Create a simple ETag.
 *
 * @param {string|Buffer|Stats} entity
 * @param {object} [options]
 * @param {boolean} [options.weak]
 * @return {String}
 * @public
 */

export default function etag (entity = null, options = {}) {
  const entityIsStats = (entity instanceof Stats)
  if (!(entityIsStats || typeof entity === 'string' || Buffer.isBuffer(entity))) {
    throw new TypeError('argument entity must be string, Buffer, or fs.Stats')
  }

  const tag = entityIsStats ? stattag(entity) : entitytag(entity)
  const weak = (typeof options.weak === 'boolean') ? options.weak : entityIsStats

  return weak ? `W/${tag}` : tag
}
