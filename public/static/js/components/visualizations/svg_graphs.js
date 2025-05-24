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
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 600;
    this.height = options.height || 300;
    this.padding = options.padding || 40;
    this.colors = options.colors || ['#3e3eff', '#4caf50', '#f44336', '#ff9800'];
    this.maxValue = options.maxValue || null;
    this.gridLines = options.gridLines || null;
    this.barSpacing = options.barSpacing || 10;
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
    
    // Find max value for scaling
    const maxDataValue = Math.max(...this.data.map(d => d.count || 0));
    const maxValue = this.maxValue || maxDataValue;
    
    // Calculate bar width based on available space
    const barWidth = (this.width - 2 * this.padding - (this.data.length - 1) * this.barSpacing) / this.data.length;
    
    // Add grid lines
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('class', 'grid-lines');
    
    const gridValues = this.gridLines || [0, maxValue / 4, maxValue / 2, (3 * maxValue) / 4, maxValue];
    
    gridValues.forEach(value => {
      const y = this.height - this.padding - (value / maxValue) * (this.height - 2 * this.padding);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', this.padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', this.width - this.padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)');
      line.setAttribute('stroke-width', '1');
      gridGroup.appendChild(line);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.padding - 5);
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', '12px');
      text.textContent = value;
      gridGroup.appendChild(text);
    });
    
    svg.appendChild(gridGroup);
    
    // Add bars
    this.data.forEach((item, index) => {
      const x = this.padding + index * (barWidth + this.barSpacing);
      const barHeight = (item.count / maxValue) * (this.height - 2 * this.padding);
      const y = this.height - this.padding - barHeight;
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', barHeight);
      rect.setAttribute('fill', this.colors[index % this.colors.length]);
      
      svg.appendChild(rect);
      
      // Add label below bar
      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', x + barWidth / 2);
      labelText.setAttribute('y', this.height - this.padding + 20);
      labelText.setAttribute('text-anchor', 'middle');
      labelText.setAttribute('font-size', '12px');
      labelText.textContent = item.status || '';
      svg.appendChild(labelText);
      
      // Add value above bar
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', x + barWidth / 2);
      valueText.setAttribute('y', y - 5);
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12px');
      valueText.textContent = item.count || 0;
      svg.appendChild(valueText);
    });
    
    return svg;
  }
}

export class PieChart {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.colors = options.colors || ['#3e3eff', '#4caf50', '#f44336', '#ff9800', '#9c27b0', '#607d8b'];
    this.showLabels = options.showLabels !== undefined ? options.showLabels : true;
    this.showPercentages = options.showPercentages !== undefined ? options.showPercentages : true;
    this.showLegend = options.showLegend !== undefined ? options.showLegend : true;
  }

  render() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('class', 'pie-chart');
    
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    const total = this.data.reduce((sum, item) => sum + (item.value || 0), 0);
    
    // Calculate center and radius
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 50; // Leave space for labels
    
    let startAngle = 0;
    
    // Create pie slices
    this.data.forEach((item, index) => {
      if (!item.value) return;
      
      const percentage = item.value / total;
      const endAngle = startAngle + percentage * 2 * Math.PI;
      
      // Calculate points for the slice path
      const startX = centerX + radius * Math.cos(startAngle);
      const startY = centerY + radius * Math.sin(startAngle);
      const endX = centerX + radius * Math.cos(endAngle);
      const endY = centerY + radius * Math.sin(endAngle);
      
      // Create the slice path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const largeArcFlag = percentage > 0.5 ? 1 : 0;
      
      path.setAttribute('d', `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`);
      path.setAttribute('fill', this.colors[index % this.colors.length]);
      path.setAttribute('class', 'pie-slice');
      
      svg.appendChild(path);
      
      // Add label if needed
      if (this.showLabels || this.showPercentages) {
        const labelAngle = startAngle + (endAngle - startAngle) / 2;
        const labelRadius = radius * 0.7; // Position label inside the slice
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12px');
        
        if (this.showLabels && this.showPercentages) {
          text.textContent = `${Math.round(percentage * 100)}%`;
        } else if (this.showLabels) {
          text.textContent = item.label;
        } else if (this.showPercentages) {
          text.textContent = `${Math.round(percentage * 100)}%`;
        }
        
        svg.appendChild(text);
      }
      
      startAngle = endAngle;
    });
    
    // Add legend if needed
    if (this.showLegend) {
      const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendGroup.setAttribute('class', 'legend');
      
      this.data.forEach((item, index) => {
        const legendY = this.height - 20 - index * 20;
        
        // Legend color box
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 10);
        rect.setAttribute('y', legendY - 10);
        rect.setAttribute('width', 10);
        rect.setAttribute('height', 10);
        rect.setAttribute('fill', this.colors[index % this.colors.length]);
        legendGroup.appendChild(rect);
        
        // Legend text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 25);
        text.setAttribute('y', legendY);
        text.setAttribute('font-size', '12px');
        
        const percentage = item.value / total;
        text.textContent = `${item.label}: ${item.value} (${Math.round(percentage * 100)}%)`;
        
        legendGroup.appendChild(text);
      });
      
      svg.appendChild(legendGroup);
    }
    
    return svg;
  }
}

export class DonutChart {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.colors = options.colors || ['#3e3eff', '#4caf50', '#f44336', '#ff9800', '#9c27b0', '#607d8b'];
    this.showLabels = options.showLabels !== undefined ? options.showLabels : true;
    this.showPercentages = options.showPercentages !== undefined ? options.showPercentages : true;
    this.showLegend = options.showLegend !== undefined ? options.showLegend : true;
    this.showTotal = options.showTotal !== undefined ? options.showTotal : false;
    this.totalLabel = options.totalLabel || 'Total';
    this.innerRadiusRatio = options.innerRadiusRatio || 0.5; // Ratio of inner to outer radius
  }

  render() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('class', 'donut-chart');
    
    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }
    
    const total = this.data.reduce((sum, item) => sum + (item.value || 0), 0);
    
    // Calculate center and radius
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 50; // Leave space for labels
    const innerRadius = outerRadius * this.innerRadiusRatio;
    
    let startAngle = 0;
    
    // Create donut slices
    this.data.forEach((item, index) => {
      if (!item.value) return;
      
      const percentage = item.value / total;
      const endAngle = startAngle + percentage * 2 * Math.PI;
      
      // Calculate points for the slice path
      const outerStartX = centerX + outerRadius * Math.cos(startAngle);
      const outerStartY = centerY + outerRadius * Math.sin(startAngle);
      const outerEndX = centerX + outerRadius * Math.cos(endAngle);
      const outerEndY = centerY + outerRadius * Math.sin(endAngle);
      
      const innerStartX = centerX + innerRadius * Math.cos(endAngle);
      const innerStartY = centerY + innerRadius * Math.sin(endAngle);
      const innerEndX = centerX + innerRadius * Math.cos(startAngle);
      const innerEndY = centerY + innerRadius * Math.sin(startAngle);
      
      // Create the slice path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const largeArcFlag = percentage > 0.5 ? 1 : 0;
      
      path.setAttribute('d', `
        M ${outerStartX},${outerStartY}
        A ${outerRadius},${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX},${outerEndY}
        L ${innerStartX},${innerStartY}
        A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX},${innerEndY}
        Z
      `);
      path.setAttribute('fill', this.colors[index % this.colors.length]);
      path.setAttribute('class', 'donut-slice');
      
      svg.appendChild(path);
      
      // Add label if needed
      if (this.showLabels || this.showPercentages) {
        const labelAngle = startAngle + (endAngle - startAngle) / 2;
        const labelRadius = (outerRadius + innerRadius) / 2;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12px');
        
        if (this.showLabels && this.showPercentages) {
          text.textContent = `${Math.round(percentage * 100)}%`;
        } else if (this.showLabels) {
          text.textContent = item.label;
        } else if (this.showPercentages) {
          text.textContent = `${Math.round(percentage * 100)}%`;
        }
        
        svg.appendChild(text);
      }
      
      startAngle = endAngle;
    });
    
    // Add legend if needed
    if (this.showLegend) {
      const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendGroup.setAttribute('class', 'legend');
      
      this.data.forEach((item, index) => {
        const legendY = this.height - 20 - index * 20;
        
        // Legend color box
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 10);
        rect.setAttribute('y', legendY - 10);
        rect.setAttribute('width', 10);
        rect.setAttribute('height', 10);
        rect.setAttribute('fill', this.colors[index % this.colors.length]);
        legendGroup.appendChild(rect);
        
        // Legend text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 25);
        text.setAttribute('y', legendY);
        text.setAttribute('font-size', '12px');
        
        const percentage = item.value / total;
        text.textContent = `${item.label}: ${item.value} (${Math.round(percentage * 100)}%)`;
        
        legendGroup.appendChild(text);
      });
      
      svg.appendChild(legendGroup);
    }
    
    return svg;
  }
}
