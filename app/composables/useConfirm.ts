const state = reactive<{
  visible: boolean
  title: string
  message: string
  confirmLabel: string
  isDanger: boolean
  resolve: ((v: boolean) => void) | null
}>({
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  isDanger: true,
  resolve: null,
})

export function useConfirm() {
  function confirm(opts: {
    title: string
    message: string
    confirmLabel?: string
    isDanger?: boolean
  }): Promise<boolean> {
    state.visible = true
    state.title = opts.title
    state.message = opts.message
    state.confirmLabel = opts.confirmLabel ?? 'Confirmar'
    state.isDanger = opts.isDanger ?? true
    return new Promise((resolve) => {
      state.resolve = resolve
    })
  }

  function accept() {
    state.resolve?.(true)
    state.visible = false
  }

  function cancel() {
    state.resolve?.(false)
    state.visible = false
  }

  return { state, confirm, accept, cancel }
}
