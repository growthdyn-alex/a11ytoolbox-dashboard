/** @typedef {import('../../../types/index').VueAccessibleColorPicker.ColorHex} ColorHex */
/** @typedef {import('../../../types/index').VueAccessibleColorPicker.ColorRgb} ColorRgb */

/**
 * Converts an RGB color object to an HEX color string.
 *
 * @param {ColorRgb} rgb
 * @returns {ColorHex}
 */
export function convertRgbToHex (rgb) {
  delete(rgb.a)
  
  const hexChannels = Object.values(rgb).map(channel => {
    const int = channel * 255
    const hex = Math.round(int).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  })

  return '#' + hexChannels.join('')
}
