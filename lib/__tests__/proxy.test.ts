import { describe, it, expect } from 'vitest'

// Test the timing-safe comparison logic in isolation
// (We can't easily test the Edge middleware directly, but we can verify the algorithm)

function timingSafeEqual(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length)
  const paddedA = a.padEnd(maxLen, '\0')
  const paddedB = b.padEnd(maxLen, '\0')

  const encoder = new TextEncoder()
  const aBytes = encoder.encode(paddedA)
  const bBytes = encoder.encode(paddedB)

  let result = a.length ^ b.length
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i]
  }

  return result === 0
}

describe('Middleware timingSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqual('hello', 'hello')).toBe(true)
  })

  it('returns false for different strings of same length', () => {
    expect(timingSafeEqual('hello', 'world')).toBe(false)
  })

  it('returns false for different lengths', () => {
    expect(timingSafeEqual('short', 'a much longer string')).toBe(false)
  })

  it('returns false for empty vs non-empty', () => {
    expect(timingSafeEqual('', 'notempty')).toBe(false)
  })

  it('returns true for two empty strings', () => {
    expect(timingSafeEqual('', '')).toBe(true)
  })

  it('returns false for prefix match only', () => {
    expect(timingSafeEqual('abc', 'abcdef')).toBe(false)
  })

  it('returns false for single char difference', () => {
    expect(timingSafeEqual('abc', 'abd')).toBe(false)
  })

  it('handles unicode strings', () => {
    expect(timingSafeEqual('héllo', 'héllo')).toBe(true)
    expect(timingSafeEqual('héllo', 'hello')).toBe(false)
  })

  it('handles long strings', () => {
    const a = 'a'.repeat(10000)
    const b = 'a'.repeat(10000)
    expect(timingSafeEqual(a, b)).toBe(true)
  })

  it('returns false when strings differ only at the end', () => {
    expect(timingSafeEqual('abcdefgh1', 'abcdefgh2')).toBe(false)
  })
})
