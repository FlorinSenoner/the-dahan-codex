/**
 * Shared utilities for Spirit Island wiki scraping scripts.
 */

import * as fs from 'node:fs'
import * as https from 'node:https'

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchPage(url: string, baseUrl?: string): Promise<string> {
  const resolvedBase = baseUrl ?? new URL(url).origin
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location
          if (redirectUrl) {
            fetchPage(
              redirectUrl.startsWith('http') ? redirectUrl : `${resolvedBase}${redirectUrl}`,
              resolvedBase,
            )
              .then(resolve)
              .catch(reject)
            return
          }
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`))
          return
        }

        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => resolve(data))
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

export async function downloadImage(url: string, dest: string, baseUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Build full URL - handle relative paths
    let fullUrl: string
    if (url.startsWith('http')) {
      fullUrl = url
    } else if (url.startsWith('//')) {
      fullUrl = `https:${url}`
    } else if (url.startsWith('/')) {
      fullUrl = `${baseUrl}${url}`
    } else {
      fullUrl = `${baseUrl}/${url}`
    }

    https
      .get(fullUrl, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location
          if (redirectUrl) {
            downloadImage(redirectUrl, dest, baseUrl).then(resolve).catch(reject)
            return
          }
        }

        // Check for errors
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${fullUrl}`))
          return
        }

        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
        file.on('error', (err) => {
          fs.unlink(dest, () => {}) // Delete partial file
          reject(err)
        })
      })
      .on('error', reject)
  })
}
