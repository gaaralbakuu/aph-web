export const vLoading = {
  mounted(el, binding) {
    if (binding.value) {
      createLoader(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        createLoader(el)
      } else {
        removeLoader(el)
      }
    }
  },
  unmounted(el) {
    removeLoader(el)
  }
}

function createLoader(el) {
  if (el.querySelector('.v-loading-overlay')) return

  const overlay = document.createElement('div')
  overlay.className = 'v-loading-overlay absolute inset-0 bg-background/50 flex items-center justify-center z-50'
  overlay.innerHTML = '<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>'

  const style = getComputedStyle(el)
  if (style.position === 'static') {
    el.classList.add('relative')
  }

  el.appendChild(overlay)
}

function removeLoader(el) {
  const overlay = el.querySelector('.v-loading-overlay')
  if (overlay) {
    el.removeChild(overlay)
  }
}
