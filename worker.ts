// @ts-ignore
import { handleRequest } from '@cloudflare/next-on-pages'
// @ts-ignore
import nextConfig from './next.config'

export const onRequest = handleRequest({
  nextConfig,
})