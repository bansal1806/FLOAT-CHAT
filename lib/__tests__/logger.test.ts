// lib/__tests__/logger.test.ts
import { logger } from '../logger'

// Store original console methods
const originalLog = console.log
const originalError = console.error
const originalWarn = console.warn
const originalDebug = console.debug

describe('Logger', () => {
    beforeEach(() => {
        // Mock console methods
        console.log = jest.fn()
        console.error = jest.fn()
        console.warn = jest.fn()
        console.debug = jest.fn()
    })

    afterEach(() => {
        // Restore console methods
        console.log = originalLog
        console.error = originalError
        console.warn = originalWarn
        console.debug = originalDebug
        jest.clearAllMocks()
    })

    describe('info', () => {
        it('should log info messages in development', () => {
            logger.info('Test info message')
            expect(console.log).toHaveBeenCalled()
        })

        it('should log with context', () => {
            const context = { userId: '123', action: 'test' }
            logger.info('Test with context', context)
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('[INFO]'),
                context
            )
        })
    })

    describe('error', () => {
        it('should log errors', () => {
            const error = new Error('Test error')
            logger.error('Error occurred', error)
            expect(console.error).toHaveBeenCalled()
        })

        it('should log errors with context', () => {
            const error = new Error('Test error')
            const context = { component: 'TestComponent' }
            logger.error('Error occurred', error, context)
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[ERROR]'),
                error,
                context
            )
        })
    })

    describe('warn', () => {
        it('should log warnings', () => {
            logger.warn('Test warning')
            expect(console.warn).toHaveBeenCalled()
        })
    })

    describe('dataStream', () => {
        it('should log data stream events', () => {
            logger.dataStream('ARGO', 50, 'floats')
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Data stream updated'),
                expect.objectContaining({
                    source: 'ARGO',
                    count: 50,
                    dataType: 'floats'
                })
            )
        })
    })

    describe('service', () => {
        it('should log service start events', () => {
            logger.service('start', 'TestService')
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Service started: TestService')
            )
        })

        it('should log service stop events', () => {
            logger.service('stop', 'TestService')
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Service stopped: TestService')
            )
        })
    })
})
