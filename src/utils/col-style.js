/*
 * @Description: 拖拽排版图表用 col-style
 */
export default {
  methods: {
    previewColStyle({ width, height, baseWidth = 100, baseHeight = 3, layoutRow = 24 }, mixinStyle = {}) {
      return {
        width: `${(baseWidth * width) / layoutRow}%`,
        height: `${height / baseHeight}px`,
        ...mixinStyle
      }
    }
  }
}
