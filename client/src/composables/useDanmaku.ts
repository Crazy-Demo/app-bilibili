import { ref } from 'vue'

export function useDanmaku(player: { value: any }) {
  const enabled = ref(true)
  const opacity = ref(0.7)
  const fontSize = ref(24)
  const showSettings = ref(false)

  function toggle() {
    enabled.value = !enabled.value
    if (player.value) {
      enabled.value ? player.value.plugins?.danmuku?.show() : player.value.plugins?.danmuku?.hide()
    }
  }

  function sendDm(text: string) {
    if (!player.value || !text.trim()) return
    player.value.plugins?.danmuku?.emit({ text, mode: 'rtl', color: '#FFFFFF', size: fontSize.value })
  }

  return { enabled, opacity, fontSize, showSettings, toggle, sendDm }
}
