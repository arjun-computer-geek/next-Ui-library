import { postFormSchema, PostFormValues } from '@/lib/validators'

describe('Post Form Validation', () => {
  describe('Valid Data', () => {
    it('validates correct post data', () => {
      const validData: PostFormValues = {
        title: 'Valid Post Title',
        body: 'This is a valid post body with sufficient content.',
        tags: 'tag1,tag2,tag3',
        userId: 1,
      }

      const result = postFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('validates post with minimum required fields', () => {
      const minimalData: PostFormValues = {
        title: 'Minimal',
        body: 'Minimal body',
        tags: '',
        userId: 1,
      }

      const result = postFormSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })

    it('validates post with maximum allowed values', () => {
      const maxData: PostFormValues = {
        title: 'A'.repeat(100), // Maximum 100 characters
        body: 'B'.repeat(1000), // Maximum 1000 characters
        tags: 'tag1,tag2,tag3,tag4,tag5',
        userId: 999999,
      }

      const result = postFormSchema.safeParse(maxData)
      expect(result.success).toBe(true)
    })
  })

  describe('Title Validation', () => {
    it('requires title field', () => {
      const invalidData = {
        body: 'Valid body',
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['title'])
        expect(result.error.issues[0].message).toContain('Required')
      }
    })

    it('validates title minimum length', () => {
      const invalidData: PostFormValues = {
        title: 'A', // Less than 3 characters
        body: 'Valid body',
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['title'])
        expect(result.error.issues[0].message).toContain('at least 3')
      }
    })

    it('validates title maximum length', () => {
      const invalidData: PostFormValues = {
        title: 'A'.repeat(101), // More than 100 characters
        body: 'Valid body',
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['title'])
        expect(result.error.issues[0].message).toContain('less than 100')
      }
    })

    it('validates title with whitespace', () => {
      const dataWithWhitespace: PostFormValues = {
        title: '  Valid Title  ',
        body: 'Valid body',
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(dataWithWhitespace)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('  Valid Title  ') // No trimming in this schema
      }
    })
  })

  describe('Body Validation', () => {
    it('requires body field', () => {
      const invalidData = {
        title: 'Valid title',
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['body'])
        expect(result.error.issues[0].message).toContain('Required')
      }
    })

    it('validates body minimum length', () => {
      const invalidData: PostFormValues = {
        title: 'Valid title',
        body: 'AB', // Less than 10 characters
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['body'])
        expect(result.error.issues[0].message).toContain('at least 10')
      }
    })

    it('validates body maximum length', () => {
      const invalidData: PostFormValues = {
        title: 'Valid title',
        body: 'A'.repeat(1001), // More than 1000 characters
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['body'])
        expect(result.error.issues[0].message).toContain('less than 1000')
      }
    })

    it('validates body with whitespace', () => {
      const dataWithWhitespace: PostFormValues = {
        title: 'Valid title',
        body: '  Valid body content  ',
        tags: 'tag1',
        userId: 1,
      }

      const result = postFormSchema.safeParse(dataWithWhitespace)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.body).toBe('  Valid body content  ') // No trimming in this schema
      }
    })
  })

  describe('Tags Validation', () => {
    it('allows empty tags', () => {
      const dataWithEmptyTags: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: '',
        userId: 1,
      }

      const result = postFormSchema.safeParse(dataWithEmptyTags)
      expect(result.success).toBe(true)
    })

    it('validates tags format', () => {
      const validTagsData: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: 'tag1,tag2,tag3',
        userId: 1,
      }

      const result = postFormSchema.safeParse(validTagsData)
      expect(result.success).toBe(true)
    })

    it('validates tags with whitespace', () => {
      const dataWithWhitespace: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: '  tag1 , tag2 , tag3  ',
        userId: 1,
      }

      const result = postFormSchema.safeParse(dataWithWhitespace)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.tags).toBe('  tag1 , tag2 , tag3  ') // No trimming in this schema
      }
    })

    it('handles single tag', () => {
      const singleTagData: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: 'single-tag',
        userId: 1,
      }

      const result = postFormSchema.safeParse(singleTagData)
      expect(result.success).toBe(true)
    })
  })

  describe('UserId Validation', () => {
    it('requires userId field', () => {
      const invalidData = {
        title: 'Valid title',
        body: 'Valid body',
        tags: 'tag1',
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['userId'])
        expect(result.error.issues[0].message).toContain('Required')
      }
    })

    it('validates userId is a positive number', () => {
      const invalidData: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: 'tag1',
        userId: 0,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['userId'])
        expect(result.error.issues[0].message).toContain('positive number')
      }
    })

    it('validates userId is not negative', () => {
      const invalidData: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: 'tag1',
        userId: -1,
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['userId'])
        expect(result.error.issues[0].message).toContain('positive number')
      }
    })

    it('validates userId accepts decimal numbers', () => {
      const validData: PostFormValues = {
        title: 'Valid title',
        body: 'Valid body',
        tags: 'tag1',
        userId: 1.5,
      }

      const result = postFormSchema.safeParse(validData)
      expect(result.success).toBe(true) // Zod number() accepts decimals
    })

    it('accepts valid userId values', () => {
      const validUserIds = [1, 100, 999999]
      
      validUserIds.forEach(userId => {
        const validData: PostFormValues = {
          title: 'Valid title',
          body: 'Valid body',
          tags: 'tag1',
          userId,
        }

        const result = postFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Multiple Validation Errors', () => {
    it('reports multiple validation errors', () => {
      const invalidData = {
        title: '', // Empty title
        body: 'Short', // Too short body
        tags: 'tag1',
        userId: 0, // Invalid userId
      }

      const result = postFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1)
        
        const errorPaths = result.error.issues.map(issue => issue.path[0])
        expect(errorPaths).toContain('title')
        expect(errorPaths).toContain('body')
        expect(errorPaths).toContain('userId')
      }
    })

    it('handles completely invalid data', () => {
      const completelyInvalidData = {
        title: 123, // Wrong type
        body: null, // Wrong type
        tags: 456, // Wrong type
        userId: 'not-a-number', // Wrong type
      }

      const result = postFormSchema.safeParse(completelyInvalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles very long valid input', () => {
      const longData: PostFormValues = {
        title: 'A'.repeat(100), // Maximum allowed
        body: 'B'.repeat(1000), // Maximum allowed
        tags: 'tag1,tag2,tag3,tag4,tag5,tag6,tag7,tag8,tag9,tag10',
        userId: 999999,
      }

      const result = postFormSchema.safeParse(longData)
      expect(result.success).toBe(true)
    })

    it('handles special characters in text fields', () => {
      const specialCharData: PostFormValues = {
        title: 'Title with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
        body: 'Body with special chars: !@#$%^&*()_+-=[]{}|;:,.<>? and emojis 🚀🎉',
        tags: 'special-tag,emoji-tag🚀,unicode-tag',
        userId: 1,
      }

      const result = postFormSchema.safeParse(specialCharData)
      expect(result.success).toBe(true)
    })

    it('handles unicode characters', () => {
      const unicodeData: PostFormValues = {
        title: 'Título en español',
        body: 'Contenido en español con caracteres especiales: ñáéíóú',
        tags: 'español,caracteres-especiales',
        userId: 1,
      }

      const result = postFormSchema.safeParse(unicodeData)
      expect(result.success).toBe(true)
    })
  })
}) 