<template>
  <div class="s-canvas">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>

<script>
export default {
  name: 'SIdentify',
  props: {
    identifyCode: {
      type: String,
      default: '1234',
    },
    fontSizeMin: {
      type: Number,
      default: 25,
    },
    fontSizeMax: {
      type: Number,
      default: 35,
    },
    backgroundColorMin: {
      type: Number,
      default: 200,
    },
    backgroundColorMax: {
      type: Number,
      default: 220,
    },
    dotColorMin: {
      type: Number,
      default: 60,
    },
    dotColorMax: {
      type: Number,
      default: 120,
    },
    contentWidth: {
      type: Number,
      default: 90,
    },
    contentHeight: {
      type: Number,
      default: 38,
    },
  },
  methods: {
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    randomColor(min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return `rgb(${r},${g},${b})`
    },
    drawPic() {
      const canvas = document.getElementById('s-canvas')
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = '#e6ecfd'
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    drawText(ctx, txt, index) {
      ctx.fillStyle = this.randomColor(50, 160)
      ctx.font = `${this.randomNum(this.fontSizeMin, this.fontSizeMax)}px SimHei`
      const x = (index + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      const y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      const deg = this.randomNum(-30, 30)
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(txt, 0, 0)
      ctx.rotate((-deg * Math.PI) / 180)
      ctx.translate(-x, -y)
    },
    drawLine(ctx) {
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = this.randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot(ctx) {
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
  },
  watch: {
    identifyCode() {
      this.drawPic()
    },
  },
  mounted() {
    this.drawPic()
  },
}
</script>
