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
    
    // Add a simple placeholder if no data
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    // Simple implementation - just a placeholder
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
    svg.setAttribute('class', 'bar-graph');
    
    // Add a simple placeholder if no data
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    // Find max value for scaling
    const maxValue = Math.max(...this.data.map(d => d.count || 0));
    
    // Simple implementation - just a placeholder
    const barWidth = (this.width - 2 * this.padding) / this.data.length - 10;
    
    this.data.forEach((item, index) => {
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const x = this.padding + index * ((this.width - 2 * this.padding) / this.data.length);
      
      // Ensure we don't divide by zero and handle undefined values
      const height = maxValue > 0 ? ((item.count || 0) / maxValue) * (this.height - 2 * this.padding) : 0;
      const y = this.height - this.padding - height;
      
      bar.setAttribute('x', x);
      bar.setAttribute('y', y);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', height);
      bar.setAttribute('fill', '#3e3eff');
      
      svg.appendChild(bar);
      
      // Add label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + barWidth / 2);
      text.setAttribute('y', this.height - this.padding + 20);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = item.status;
      svg.appendChild(text);
      
      // Add count label
      const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      countText.setAttribute('x', x + barWidth / 2);
      countText.setAttribute('y', y - 10);
      countText.setAttribute('text-anchor', 'middle');
      countText.setAttribute('fill', '#333');
      countText.textContent = item.count;
      svg.appendChild(countText);
    });
    
    return svg;
  }
}
