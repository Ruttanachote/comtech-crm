/**
 * Approval Service Plugin
 * ปลั๊กอินสำหรับลงทะเบียน Approval Service
 */
import { createApprovalService } from '~/services/approval.service'

export default defineNuxtPlugin(() => {
  const approvalService = createApprovalService()

  return {
    provide: {
      approvalService
    }
  }
})
