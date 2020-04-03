export default {
  install(Vue, options) {

    Vue.prototype.$DataPoints = function (times, values) {
      let DataPoints = []
      for (let i = 0; i < times.length; i++) {
        for (let j = 0; j < values.length; j++) { }
        DataPoints.push({ time: times[i], value: values[i] })
      }
      return DataPoints
    }
  }
}