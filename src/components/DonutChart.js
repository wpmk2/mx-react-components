const React = require('react');
const d3 = require('d3');
const objectAssign = require('object-assign');

const DonutChart = React.createClass({
  propTypes: {
    activeIndex: React.PropTypes.number,
    activeOffset: React.PropTypes.number,
    animate: React.PropTypes.bool,
    arcWidth: React.PropTypes.number,
    colors: React.PropTypes.array,
    data: React.PropTypes.array.isRequired,
    height: React.PropTypes.number,
    labelStyle: React.PropTypes.object,
    onClick: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
    opacity: React.PropTypes.number,
    padAngle: React.PropTypes.number,
    radiusOffset: React.PropTypes.number,
    showLegend: React.PropTypes.bool,
    valueFormat: React.PropTypes.object,
    valueStyle: React.PropTypes.object,
    width: React.PropTypes.number
  },

  getDefaultProps () {
    return {
      activeIndex: -1,
      activeOffset: 3,
      animate: true,
      arcWidth: 80,
      colors: d3.scale.category20().range(),
      data: [],
      height: 360,
      labelStyle: {},
      onClick () {},
      onMouseEnter () {},
      onMouseLeave () {},
      opacity: 1,
      padAngle: 0.01,
      radiusOffset: 0,
      showLegend: true,
      valueFormat: {},
      valueStyle: {},
      width: 360
    };
  },

  _renderArcs () {
    const pie = d3.layout.pie().sort(null).padAngle(this.props.padAngle);
    const radius = (Math.min(this.props.width, this.props.height) / 2) - this.props.radiusOffset;
    const standardArc = d3.svg.arc().outerRadius(radius - this.props.activeOffset).innerRadius(radius - this.props.arcWidth);
    const hoverArc = d3.svg.arc().outerRadius(radius).innerRadius(radius - this.props.arcWidth);

    const dataSets = this.props.data.map(item => {
      return item.value;
    });

    return (pie(dataSets)).map((point, i) => {
      const arc = this.props.activeIndex === i && this.props.animate ? hoverArc : standardArc;

      return (
        <g
          key={i}
          onClick={this.props.onClick.bind(null, i)}
          onMouseEnter={this.props.onMouseEnter.bind(null, i)}
          onMouseLeave={this.props.onMouseLeave}
        >
          <path d={arc(point)} fill={this.props.colors[i]} opacity={this.props.opacity}></path>
        </g>
      );
    });
  },

  _renderLegend () {
    if (this.props.showLegend && this.props.activeIndex > -1) {
      const activeDataSet = this.props.data[this.props.activeIndex] || {};
      const color = this.props.colors[this.props.activeIndex];
      const labelStyle = objectAssign({
        color: '#333',
        fontSize: '18px',
        fontWeight: '800'
      }, this.props.labelStyle);
      const valueStyle = objectAssign({
        color,
        fontSize: '28px',
        fontWeight: '400'
      }, this.props.valueStyle);
      const valueFormat = objectAssign({
        decimals: 0,
        leading: '',
        trailing: ''
      }, this.props.valueFormat);
      const value = valueFormat.leading + parseFloat(activeDataSet.value).toFixed(valueFormat.decimals) + valueFormat.trailing;

      return (
        <div style={styles.center}>
            <div style={this.props.labelStyle}>
              {activeDataSet.name}
            </div>
            <div style={valueStyle}>
              {value}
            </div>
        </div>
      );
    }
  },

  render () {
    const position = 'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')';
    const componentStyle = {
      position: 'relative',
      height: this.props.height,
      width: this.props.width
    };

    return (
      <div style={ componentStyle }>
        {this._renderLegend()}
        <svg height={this.props.height} width={this.props.width}>
          <g transform={position} style={styles.pointer}>
            {this.props.data.length > 0 && this._renderArcs()}
          </g>
        </svg>
      </div>
    );
  }
});

const styles = {
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)'
  },
  pointer: {
    cursor: 'pointer'
  }
};

module.exports = DonutChart;