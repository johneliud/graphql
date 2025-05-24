export class LineGraph {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 600;
    this.height = options.height || 300;
    this.padding = options.padding || 40;
  }

  render() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('class', 'line-graph');
    svg.style.margin = '0 auto';
    svg.style.display = 'block';
    
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    // Add background grid lines for better readability
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('class', 'grid-lines');
    
    // Add horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = this.padding + (i / 5) * (this.height - 2 * this.padding);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', this.padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', this.width - this.padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)');
      line.setAttribute('stroke-width', '1');
      gridGroup.appendChild(line);
    }
    
    svg.appendChild(gridGroup);
    
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
    
    // Add data points
    this.data.forEach((item, index) => {
      const x = this.padding + (index / (this.data.length - 1 || 1)) * (this.width - 2 * this.padding);
      const y = this.height - this.padding - ((item.amount || 0) / (maxAmount || 1)) * (this.height - 2 * this.padding);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#3e3eff');
      
      svg.appendChild(circle);
    });
    
    return svg;
  }
}

export class BarGraph {
  // Same implementation as before
  // ...
}

export class PieChart {
  // Same implementation as before
  // ...
}

export class DonutChart {
  // Same implementation as before
  // ...
}