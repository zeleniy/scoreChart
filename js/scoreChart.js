/**
 * Line chart.
 * @public
 * @class
 */
class ScoreChart {


  /**
   * @public
   * @constructor
   * @param {Object} dataSet
   */
  constructor(dataSet) {

    this._dataSet = dataSet;

    this._duration = 1000;
    this._outerRadius = 67;
    this._arcsGap = 9;
    this._arcsData = [{
      from: 0,
      to: 90,
      domain: [0, 30]
    }, {
      from: 90,
      to: 180,
      domain: [0, 20]
    }, {
      from: 180,
      to: 360,
      domain: [0, 50]
    }].map(function(d) {
      d.from += this._arcsGap;
      d.to -= this._arcsGap;
      return d;
    }.bind(this));

    this._scoresData = [{
      color: '#FB738B',
      to: this._dataSet.flexibleScore
    }, {
      color: '#67B9F6',
      to: this._dataSet.savingsScore
    }, {
      color: '#69D9AB',
      to: this._dataSet.fixedScore
    }].map(function(d, i) {
      d.from = this._arcsData[i].from;
      return d;
    }, this);

    this._margin = {
      left: 15,
      top: 10,
      right: 15,
      bottom: 10
    };

    this._scoreBorderThickness = 2.4;

    d3.select(window).on('resize.' + this._id, function() {
      this.resize();
    }.bind(this));
  }


  _scaleValue(value, config) {

    value = d3.scaleLinear()
      .domain(config.domain)
      .range([config.from, config.to])
      (value);

    return value;
  }


  /**
   * Render chart.
   * @param {String|HTMLElement} selector
   * @returns {ScoreChart}
   */
  renderTo(selector) {

    this._container = d3.select(selector)
      .classed('score-chart', true);

    const box = this._container.node().getBoundingClientRect();

    const width = box.width || this.getOuterWidth();
    const height = box.height || this.getOuterHeight();

    this._svg = this._container
      .append('svg')
      .attr('height', height)
      .attr('width', width);

    this._canvas = this._svg
      .append('g')
      .attr('class', 'canvas');

    this._scoreBgCircle = this._canvas
      .append('circle')
      .style('fill', '#fff')
      .style('stroke', '#67B9F6')
      .style('stroke-width', this._scoreBorderThickness);

    this._scoreCircle = this._canvas
      .append('circle')
      .style('fill', '#67B9F6');

    this._score = this._canvas
      .append('text')
      .attr('class', 'score-number-text')
      .attr('dy', '0.3em')
      .text(0);

    this._bgArcs = this._canvas
      .selectAll('path.track')
      .data(this._arcsData)
      .enter()
      .append('path')
      .attr('class', 'arc track');

    this._scoreArcs = this._canvas
      .selectAll('path.score')
      .data(this._scoresData)
      .enter()
      .append('path')
      .attr('class', 'arc score')
      .style('stroke', d => d.color);

    this._scores = this._canvas
      .selectAll('g.score')
      .data(this._scoresData)
      .enter()
      .append('g')
      .attr('class', 'score');

    this._scoreCircles = this._scores
      .append('circle')
      .attr('r', 10)
      .style('fill', d => d.color);

    this._scoreValues = this._scores
      .append('text')
      .attr('class', 'score')
      .attr('dy', '0.3em')
      .text(0);

    this._fixedTooltip = this._canvas
      .append('g')
      .attr('class', 'tooltip');
    this._fixedText = this._fixedTooltip
      .selectAll('text')
      .data([['fixed'], [this._dataSet.fixedScore, '/50', ' points']])
      .enter()
      .append('text')
      .attr('class', (d, i) => i == 0 ? 'left score-title fixed-score' : 'left')
      .attr('dy', '0.3em');
    this._fixedText.selectAll('tspan')
      .data(function(d, i) {
        return d;
      }).enter()
      .append('tspan')
      .attr('class', (d, i) => i == 0 ? 'score-title fixed-score' : 'score-label')
      .text(String);

    this._flexibleTooltip = this._canvas
      .append('g')
      .attr('class', 'tooltip');
    this._flexibleText = this._flexibleTooltip
      .selectAll('text')
      .data([['flexible'], [this._dataSet.flexibleScore, '/30', ' points']])
      .enter()
      .append('text')
      .attr('class', (d, i) => i == 0 ? 'right score-title flexible-score' : 'right')
      .attr('dy', '0.3em');
    this._flexibleText.selectAll('tspan')
      .data(function(d, i) {
        return d;
      }).enter()
      .append('tspan')
      .attr('class', (d, i) => i == 0 ? 'score-title flexible-score' : 'score-label')
      .text(String);

    this._savingsTooltip = this._canvas
      .append('g')
      .attr('class', 'tooltip');
    this._savingsText = this._savingsTooltip
      .selectAll('text')
      .data([['net-worth'], [this._dataSet.savingsScore, '/20', ' points']])
      .enter()
      .append('text')
      .attr('class', (d, i) => i == 0 ? 'right score-title savings-score' : 'right')
      .attr('dy', '0.3em');
    this._savingsText.selectAll('tspan')
      .data(function(d, i) {
        return d;
      }).enter()
      .append('tspan')
      .attr('class', (d, i) => i == 0 ? 'score-title savings-score' : 'score-label')
      .text(String);

    this._container
      .selectAll('div')
      .data(['Your Medean Score', 'Keep an eye on your flexible expenses, which seems to be your weekest point 😅'])
      .enter()
      .append('div')
      .attr('class', (d, i) => i == 0 ? 'score-widget-headline' : 'score-widget-text')
      .text(String)

    return this.update();
  }


  /**
   * Update chart.
   * @public
   * @returns {ScoreChart}
   */
  update() {

    var interpolator = d3.interpolate(0, this._dataSet.score);

    this._score
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .tween('text', function(d, i, selection) {
        return function(t) {
          d3.select(this).text(parseInt(interpolator(t), 10));
        }.bind(this);
      });

      this._scoreValues
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .tween('text', function(d, i, selection) {
          var interpolator = d3.interpolate(0, d.to);
          return function(t) {
            d3.select(this).text(parseInt(interpolator(t), 10));
          }.bind(this);
        });

    // this._canvas
    //   .selectAll('g.tooltip')
    //   .selectAll('text')
    //   .filter((d, i) => i == 1)
    //   .select('tspan')
    //   .transition()
    //   .ease(d3.easeLinear)
    //   .duration(1000)
    //   .tween('text', function(d, i, selection) {
    //     var interpolator = d3.interpolate(0, d[0]);
    //     return function(t) {
    //       d3.select(this).text(parseInt(interpolator(t), 10));
    //     }.bind(this);
    //   });

    var self = this;
    const center = {
      x: this.getInnerWidth() / 2,
      y: 220 / 2
    }

    this._scores
      .attr('transform', function(d, i) {
        return 'translate(' + [
          center.x + this._outerRadius * Math.cos(this._toRadians(d.from - 90)),
          center.y + this._outerRadius * Math.sin(this._toRadians(d.from - 90))] +
        ')';
      }.bind(this))
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .tween('text', function(d, i, selection) {
        var f = d3.interpolate(d.from - 90, self._scaleValue(d.to, self._arcsData[i]) - 90);
        return function(t) {
          d3.select(this)
            .attr('transform', function(d, i) {
              return 'translate(' + [
                center.x + self._outerRadius * Math.cos(self._toRadians(f(t))),
                center.y + self._outerRadius * Math.sin(self._toRadians(f(t)))] +
              ')';
            }.bind(this));
        }.bind(this);
      });

    return this.resize();
  }


  /**
   * Resize chart.
   * @public
   * @returns {ScoreChart}
   */
  resize() {

    this._svg
      .attr('width', this.getOuterWidth())
      .attr('height', 220);

    const margin = this._getMargin();
    const center = {
      x: this.getInnerWidth() / 2,
      y: 220 / 2
    }

    this._canvas
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

    this._scoreBgCircle
      .attr('r', 48 - this._scoreBorderThickness)
      .attr('cx', center.x)
      .attr('cy', center.y);

    this._scoreCircle
      .attr('r', 48 - this._scoreBorderThickness * 2.4)
      .attr('cx', center.x)
      .attr('cy', center.y);

    this._score
      .attr('x', center.x)
      .attr('y', center.y);

    this._bgArcs
      .attr('transform', 'translate(' + [center.x, center.y] + ')')
      .attr('d', function(d) {
        return d3.arc()
            .startAngle(this._toRadians(d.from))
            .endAngle(this._toRadians(d.to))
            .outerRadius(this._outerRadius)
            .innerRadius(this._outerRadius)();
      }.bind(this));

    this._scoreArcs
      .attr('transform', 'translate(' + [center.x, center.y] + ')')
      .attr('d', function(d, i) {
        return d3.arc()
            .startAngle(this._toRadians(d.from))
            .endAngle(this._toRadians(this._scaleValue(d.to, this._arcsData[i])))
            .outerRadius(this._outerRadius)
            .innerRadius(this._outerRadius)();
      }.bind(this));

      this._fixedText
        .attr('x', 110)
        .attr('y', (d, i) => 100 + 20 * i);

      this._flexibleText
        .attr('x', 310)
        .attr('y', (d, i) => 60 + 20 * i);

      this._savingsText
        .attr('x', 310)
        .attr('y', (d, i) => 145 + 20 * i);

    return this;
  }


  _toRadians(degrees) {

    return degrees * Math.PI / 180;
  }


  _toDegrees(radians) {

    return radians * 180 / Math.PI;
  };


  /**
   * Get margin.
   * @private
   * @returns {Object}
   */
  _getMargin() {

    return JSON.parse(JSON.stringify(this._margin));
  }


  /**
   * Get container dimensions.
   * @private
   * @returns {Object}
   */
  _getSize() {

    return this._container.node().getBoundingClientRect();
  }


  /**
   * Get outer width.
   * @public
   * @returns {Number}
   */
  getOuterWidth() {

    return this._getSize().width;
  }


  /**
   * Get outer height.
   * @public
   * @returns {Number}
   */
  getOuterHeight() {

    return this._getSize().height || this._defaults.height;
  }


  /**
   * Get inner width.
   * @public
   * @returns {Number}
   */
  getInnerWidth() {

    const margin = this._getMargin();
    return this._getSize().width - margin.left - margin.right;
  }

  /**
   * Get inner height.
   * @public
   * @returns {Number}
   */
  getInnerHeight() {

    const margin = this._getMargin();
    return this._getSize().height - margin.top - margin.bottom;
  }


  /**
   * Generate unique string.
   * @private
   * @returns {String}
   */
  _getUniqueId() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
