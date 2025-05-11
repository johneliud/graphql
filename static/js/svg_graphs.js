export class SVGGraph {
  constructor(width = 400, height = 300) {
    this.width = width;
    this.height = height;
    this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.svg = this.createSVG();
  }

  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    return svg;
  }

  addTitle(title) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', this.width / 2);
    text.setAttribute('y', 20);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = title;
    text.setAttribute('font-size', '16');
    text.setAttribute('font-weight', 'bold');
    this.svg.appendChild(text);
  }

  addXAxisLabel(label) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', this.width / 2);
    text.setAttribute('y', this.height - 10);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = label;
    this.svg.appendChild(text);
  }

  addYAxisLabel(label) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', -this.height / 2);
    text.setAttribute('y', -20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('transform', 'rotate(-90)');
    text.textContent = label;
    this.svg.appendChild(text);
  }
}

export class LineGraph extends SVGGraph {
  constructor(data, width = 400, height = 300) {
    super(width, height);
    this.data = data;
    this.xScale = this.createXScale();
    this.yScale = this.createYScale();
  }

  createXScale() {
    const dates = this.data.map(d => new Date(d.createdAt));
    return (date) => {
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const range = maxDate - minDate;
      return (date - minDate) / range * (this.width - this.margin.left - this.margin.right) + this.margin.left;
    };
  }

  createYScale() {
    const values = this.data.map(d => d.amount);
    const max = Math.max(...values);
    return (value) => {
      return this.height - this.margin.top - (value / max) * (this.height - this.margin.top - this.margin.bottom);
    };
  }

  render() {
    this.addTitle('XP Progress Over Time');
    this.addXAxisLabel('Time');
    this.addYAxisLabel('XP Amount');

    // Draw line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', this.data.map(d => 
      `L${this.xScale(new Date(d.createdAt))},${this.yScale(d.amount)}`
    ).join(' '));
    path.setAttribute('stroke', '#2196F3');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    this.svg.appendChild(path);

    return this.svg;
  }
}

export class BarGraph extends SVGGraph {
  constructor(data, width = 400, height = 300) {
    super(width, height);
    this.data = data;
    this.barWidth = (this.width - this.margin.left - this.margin.right) / data.length;
  }

  render() {
    this.addTitle('Project Status Distribution');
    this.addXAxisLabel('Project Status');
    this.addYAxisLabel('Number of Projects');

    // Calculate max value for scaling
    const max = Math.max(...this.data.map(d => d.count));

    // Draw bars
    this.data.forEach((d, index) => {
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', this.margin.left + index * this.barWidth);
      bar.setAttribute('y', this.height - this.margin.bottom - (d.count / max) * (this.height - this.margin.top - this.margin.bottom));
      bar.setAttribute('width', this.barWidth - 5);
      bar.setAttribute('height', (d.count / max) * (this.height - this.margin.top - this.margin.bottom));
      bar.setAttribute('fill', d.status === 'finished' ? '#4CAF50' : '#F44336');
      this.svg.appendChild(bar);

      // Add labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.margin.left + index * this.barWidth + this.barWidth / 2);
      text.setAttribute('y', this.height - 10);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = d.status;
      this.svg.appendChild(text);
    });

    return this.svg;
  }
}
