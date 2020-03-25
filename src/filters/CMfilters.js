var CMfilters = {

  // Max
  CMMax: function (state) {

    return Math.max(...state)
  },
  CMMin: function (state) {
    return Math.min(...state)
  },
  CMAvg: function (state) {
    var sum = 0;
    for (var i = 0; i < state.length; i++) {
      sum += state[i];
    }
    var mean = sum / state.length;
    return mean.toFixed(8)
  }

}

export default CMfilters