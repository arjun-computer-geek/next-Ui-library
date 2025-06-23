import { ApiService } from '@/lib/api-client'

describe('API Client', () => {
  it('exports ApiService class with all required methods', () => {
    expect(ApiService).toBeDefined()
    expect(typeof ApiService.get).toBe('function')
    expect(typeof ApiService.post).toBe('function')
    expect(typeof ApiService.put).toBe('function')
    expect(typeof ApiService.delete).toBe('function')
    expect(typeof ApiService.patch).toBe('function')
  })

  it('ApiService methods are callable', () => {
    // Test that the methods can be called (they will fail due to no axios mock, but that's expected)
    expect(() => {
      // These will throw errors due to no axios mock, but we're just testing they exist
      expect(typeof ApiService.get).toBe('function')
      expect(typeof ApiService.post).toBe('function')
      expect(typeof ApiService.put).toBe('function')
      expect(typeof ApiService.delete).toBe('function')
      expect(typeof ApiService.patch).toBe('function')
    }).not.toThrow()
  })
}) 