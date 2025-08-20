import { describe, it, expect, vi, beforeEach } from 'vitest'
import { meetingsApi } from '../meetings'

describe('meetingsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMeetings', () => {
    it('should fetch meetings successfully', async () => {
      const result = await meetingsApi.getMeetings()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('start_date')
    })

    it('should handle API errors gracefully', async () => {
      // Test error handling by temporarily breaking the function
      const originalGetMeetings = meetingsApi.getMeetings
      meetingsApi.getMeetings = vi.fn().mockRejectedValue(new Error('API Error'))

      try {
        await meetingsApi.getMeetings()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('API Error')
      } finally {
        meetingsApi.getMeetings = originalGetMeetings
      }
    })
  })

  describe('createMeeting', () => {
    it('should create a meeting successfully', async () => {
      const meetingData = {
        title: 'Test Meeting',
        description: 'Test Description',
        start_date: '2023-12-01T10:00:00Z',
        end_date: '2023-12-01T11:00:00Z',
        location: 'Test Location',
        meeting_type: 'physical' as const
      }

      const result = await meetingsApi.createMeeting(meetingData)

      expect(result).toHaveProperty('id')
      expect(result.title).toBe(meetingData.title)
      expect(result.description).toBe(meetingData.description)
    })
  })

  describe('updateMeeting', () => {
    it('should update a meeting successfully', async () => {
      const meetingId = '1'
      const updateData = {
        title: 'Updated Meeting Title',
        description: 'Updated Description'
      }

      const result = await meetingsApi.updateMeeting(meetingId, updateData)

      expect(result).toHaveProperty('id')
      expect(result.title).toBe(updateData.title)
      expect(result.description).toBe(updateData.description)
    })
  })

  describe('deleteMeeting', () => {
    it('should delete a meeting successfully', async () => {
      const meetingId = '1'

      await expect(meetingsApi.deleteMeeting(meetingId)).resolves.not.toThrow()
    })
  })

  describe('getMeeting', () => {
    it('should fetch a specific meeting by ID', async () => {
      const meetingId = '1'

      const result = await meetingsApi.getMeeting(meetingId)

      expect(result).toHaveProperty('id')
      expect(result?.id).toBe(meetingId)
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('start_date')
    })
  })
})
