import assert from 'node:assert'
import { describe, it } from 'node:test'
import { Buffer } from 'node:buffer'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import etag from '../index.js'

const isweak = tag => tag.startsWith('W/')
const filename = resolve('package.json')

describe('etag(entity)', function () {
  it('should require an entity', () => assert.throws(etag.bind(), /argument entity must be/))

  it('should reject number entities', () => assert.throws(etag.bind(null, 4), /argument entity must be/))

  describe('when "entity" is a string', () => {
    it('should generate a strong ETag', () => assert.strictEqual(etag('beep boop'), '"9-fINXV39R1PCo05OqGqr7KIY9lCE"'))
    it('should work containing Unicode', () => {
      assert.strictEqual(etag('论'), '"3-QkSKq8sXBjHL2tFAZknA2n6LYzM"')
      assert.strictEqual(etag('论', { weak: true }), 'W/"3-QkSKq8sXBjHL2tFAZknA2n6LYzM"')
    })

    it('should work for empty string', () => assert.strictEqual(etag(''), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'))
  })

  describe('when "entity" is a Buffer', () => {
    it('should generate a strong ETag', () => assert.strictEqual(etag(Buffer.from([1, 2, 3])), '"3-cDeAcZjCKn0rCAc3HXY3eahP388"'))
    it('should work for empty Buffer', () => assert.strictEqual(etag(Buffer.alloc(0)), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'))
  })

  describe('when "entity" is a fs.Stats', () => {
    it('should generate a weak ETag', () => assert.ok(isweak(etag(statSync(filename)))))
    it('should generate consistently', () => assert.strictEqual(etag(statSync(filename)), etag(statSync(filename))))
  })

  describe('with "weak" option', () => {
    describe('when "false"', () => {
      it('should generate a strong ETag for a string', () => {
        assert.strictEqual(etag('', { weak: false }), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
        assert.strictEqual(etag('beep boop', { weak: false }), '"9-fINXV39R1PCo05OqGqr7KIY9lCE"')
        // assert.strictEqual(etag(str5kb, { weak: false }), '"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"')
      })

      it('should generate a strong ETag for a Buffer', () => {
        assert.strictEqual(etag(Buffer.alloc(0), { weak: false }), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
        assert.strictEqual(etag(Buffer.from([1, 2, 3]), { weak: false }), '"3-cDeAcZjCKn0rCAc3HXY3eahP388"')
        // assert.strictEqual(etag(buf5kb, { weak: false }), '"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"')
      })

      it('should generate a strong ETag for fs.Stats', () => {
        assert.ok(!isweak(etag(statSync(filename), { weak: false })))
      })
    })

    describe('when "true"', () => {
      it('should generate a weak ETag for a string', () => {
        assert.strictEqual(etag('', { weak: true }), 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
        assert.strictEqual(etag('beep boop', { weak: true }), 'W/"9-fINXV39R1PCo05OqGqr7KIY9lCE"')
        // assert.strictEqual(etag(str5kb, { weak: true }), 'W/"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"')
      })

      it('should generate a weak ETag for a Buffer', () => {
        assert.strictEqual(etag(Buffer.alloc(0), { weak: true }), 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
        assert.strictEqual(etag(Buffer.from([1, 2, 3]), { weak: true }), 'W/"3-cDeAcZjCKn0rCAc3HXY3eahP388"')
        // assert.strictEqual(etag(buf5kb, { weak: true }), 'W/"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"')
      })

      it('should generate a weak ETag for fs.Stats', () => assert.ok(isweak(etag(statSync(filename), { weak: true }))))

      it('should generate different ETags for different strings', () => assert.notStrictEqual(etag('plumless', { weak: true }), etag('buckeroo', { weak: true })))
    })
  })
})

/*
var buf5kb = getbuffer(5 * 1024)
var str5kb = getbuffer(5 * 1024).toString()

function getbuffer (size) {
  var buffer = Buffer.alloc(size)
  var rng = seedrandom('etag test')

  for (var i = 0; i < buffer.length; i++) {
    buffer[i] = (rng() * 94 + 32) | 0
  }

  return buffer
}
*/
