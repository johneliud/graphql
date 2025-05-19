export class LineGraph {
  constructor(data) {
    this.data = data;
    this.width = 600;
    this.height = 300;
    this.padding = 40;
  }

  render() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('class', 'line-graph');
    
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#3e3eff');
    polyline.setAttribute('stroke-width', '2');
    
    // Find max amount for scaling
    const maxAmount = Math.max(...this.data.map(d => d.amount || 0));
    
    // Generate points
    const points = this.data.map((item, index) => {
      const x = this.padding + (index / (this.data.length - 1 || 1)) * (this.width - 2 * this.padding);
      const y = this.height - this.padding - ((item.amount || 0) / (maxAmount || 1)) * (this.height - 2 * this.padding);
      return `${x},${y}`;
    }).join(' ');
    
    polyline.setAttribute('points', points);
    svg.appendChild(polyline);
    
    return svg;
  }
}

export class BarGraph {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 600;
    this.height = options.height || 300;
    this.padding = options.padding || 40;
    this.maxValue = options.maxValue || null;
    this.showValues = options.showValues !== undefined ? options.showValues : true;
    this.barSpacing = options.barSpacing || 10;
    this.gridLines = options.gridLines || [0, 25, 50, 75, 100];
    this.colors = options.colors || ['#3e3eff'];
  }

  render() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('class', 'bar-graph');
    
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    // Find max value for scaling or use provided maxValue
    const maxValue = this.maxValue || Math.max(...this.data.map(d => d.count || 0));
    
    if (this.gridLines && this.gridLines.length > 0) {
      this.gridLines.forEach(value => {
        if (value <= maxValue) {
          const y = this.height - this.padding - (value / maxValue) * (this.height - 2 * this.padding);
          
          // Add grid line
          const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          gridLine.setAttribute('x1', this.padding);
          gridLine.setAttribute('y1', y);
          gridLine.setAttribute('x2', this.width - this.padding);
          gridLine.setAttribute('y2', y);
          gridLine.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)');
          gridLine.setAttribute('stroke-width', '1');
          gridLine.setAttribute('stroke-dasharray', '4');
          svg.appendChild(gridLine);
          
          // Add value label
          const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          valueLabel.setAttribute('x', this.padding - 10);
          valueLabel.setAttribute('y', y + 5);
          valueLabel.setAttribute('text-anchor', 'end');
          valueLabel.setAttribute('font-size', '12');
          valueLabel.textContent = value;
          svg.appendChild(valueLabel);
        }
      });
    }
    
    // Calculate bar width based on available space and number of bars
    const barWidth = (this.width - 2 * this.padding - (this.data.length - 1) * this.barSpacing) / this.data.length;
    
    // Draw bars
    this.data.forEach((item, index) => {
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const x = this.padding + index * (barWidth + this.barSpacing);
      
      // Ensure we don't divide by zero and handle undefined values
      const height = maxValue > 0 ? ((item.count || 0) / maxValue) * (this.height - 2 * this.padding) : 0;
      const y = this.height - this.padding - height;
      
      bar.setAttribute('x', x);
      bar.setAttribute('y', y);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', height);
      bar.setAttribute('fill', this.colors[index % this.colors.length]);
      bar.setAttribute('rx', '3'); // Rounded corners
      bar.setAttribute('ry', '3');
      
      svg.appendChild(bar);
      
      // Add label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + barWidth / 2);
      text.setAttribute('y', this.height - this.padding + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      
      // Handle long labels by truncating or rotating
      if (item.status.length > 10) {
        text.setAttribute('transform', `rotate(45, ${x + barWidth / 2}, ${this.height - this.padding + 20})`);
        text.setAttribute('x', x + barWidth / 2 - 10);
        text.setAttribute('text-anchor', 'end');
      }
      
      text.textContent = item.status;
      svg.appendChild(text);
      
      // Add count label if showValues is true
      if (this.showValues) {
        const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        countText.setAttribute('x', x + barWidth / 2);
        countText.setAttribute('y', y - 10);
        countText.setAttribute('text-anchor', 'middle');
        countText.setAttribute('fill', '#333');
        countText.setAttribute('font-size', '12');
        countText.setAttribute('font-weight', 'bold');
        countText.textContent = item.count;
        svg.appendChild(countText);
      }
    });
    
    return svg;
  }
}
