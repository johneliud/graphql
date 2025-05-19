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
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }

    const polyline = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#3e3eff');
    polyline.setAttribute('stroke-width', '2');

    // Find max amount for scaling
    const maxAmount = Math.max(...this.data.map((d) => d.amount || 0));

    // Generate points
    const points = this.data
      .map((item, index) => {
        const x =
          this.padding +
          (index / (this.data.length - 1 || 1)) *
            (this.width - 2 * this.padding);
        const y =
          this.height -
          this.padding -
          ((item.amount || 0) / (maxAmount || 1)) *
            (this.height - 2 * this.padding);
        return `${x},${y}`;
      })
      .join(' ');

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
    this.showValues =
      options.showValues !== undefined ? options.showValues : true;
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
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }

    // Find max value for scaling or use provided maxValue
    const maxValue =
      this.maxValue || Math.max(...this.data.map((d) => d.count || 0));

    if (this.gridLines && this.gridLines.length > 0) {
      this.gridLines.forEach((value) => {
        if (value <= maxValue) {
          const y =
            this.height -
            this.padding -
            (value / maxValue) * (this.height - 2 * this.padding);

          // Add grid line
          const gridLine = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'line'
          );
          gridLine.setAttribute('x1', this.padding);
          gridLine.setAttribute('y1', y);
          gridLine.setAttribute('x2', this.width - this.padding);
          gridLine.setAttribute('y2', y);
          gridLine.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)');
          gridLine.setAttribute('stroke-width', '1');
          gridLine.setAttribute('stroke-dasharray', '4');
          svg.appendChild(gridLine);

          // Add value label
          const valueLabel = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'text'
          );
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
    const barWidth =
      (this.width -
        2 * this.padding -
        (this.data.length - 1) * this.barSpacing) /
      this.data.length;

    // Draw bars
    this.data.forEach((item, index) => {
      const bar = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      const x = this.padding + index * (barWidth + this.barSpacing);

      // Ensure we don't divide by zero and handle undefined values
      const height =
        maxValue > 0
          ? ((item.count || 0) / maxValue) * (this.height - 2 * this.padding)
          : 0;
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
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.setAttribute('x', x + barWidth / 2);
      text.setAttribute('y', this.height - this.padding + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');

      // Handle long labels by truncating or rotating
      if (item.status.length > 10) {
        text.setAttribute(
          'transform',
          `rotate(45, ${x + barWidth / 2}, ${this.height - this.padding + 20})`
        );
        text.setAttribute('x', x + barWidth / 2 - 10);
        text.setAttribute('text-anchor', 'end');
      }

      text.textContent = item.status;
      svg.appendChild(text);

      // Add count label if showValues is true
      if (this.showValues) {
        const countText = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        );
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

export class PieChart {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 300;
    this.height = options.height || 300;
    this.radius = Math.min(this.width, this.height) / 2 - 40;
    this.colors = options.colors || [
      '#3e3eff',
      '#f44336',
      '#4caf50',
      '#ff9800',
      '#9c27b0',
    ];
    this.showLabels =
      options.showLabels !== undefined ? options.showLabels : true;
    this.showPercentages =
      options.showPercentages !== undefined ? options.showPercentages : true;
    this.showLegend =
      options.showLegend !== undefined ? options.showLegend : true;
    this.legendPosition = options.legendPosition || 'right';
  }

  render() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('class', 'pie-chart');

    if (!this.data || this.data.length === 0) {
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.setAttribute('x', this.width / 2);
      text.setAttribute('y', this.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = 'No data available';
      svg.appendChild(text);
      return svg;
    }

    // Calculate total value
    const total = this.data.reduce((sum, item) => sum + (item.value || 0), 0);

    // Create group for the pie chart
    const pieGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    pieGroup.setAttribute(
      'transform',
      `translate(${this.width / 2}, ${this.height / 2})`
    );

    // Draw pie slices
    let startAngle = 0;
    this.data.forEach((item, index) => {
      if (!item.value || item.value === 0) return;

      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * Math.PI * 2;
      const endAngle = startAngle + angle;

      // Calculate arc path
      const x1 = this.radius * Math.cos(startAngle - Math.PI / 2);
      const y1 = this.radius * Math.sin(startAngle - Math.PI / 2);
      const x2 = this.radius * Math.cos(endAngle - Math.PI / 2);
      const y2 = this.radius * Math.sin(endAngle - Math.PI / 2);

      // Create arc path
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      const pathData = [
        `M 0 0`,
        `L ${x1} ${y1}`,
        `A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      const slice = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      slice.setAttribute('d', pathData);
      slice.setAttribute('fill', this.colors[index % this.colors.length]);
      slice.setAttribute('stroke', '#fff');
      slice.setAttribute('stroke-width', '1');

      // Add hover effect
      slice.setAttribute('class', 'pie-slice');
      slice.addEventListener('mouseover', () => {
        slice.setAttribute('opacity', '0.8');
      });
      slice.addEventListener('mouseout', () => {
        slice.setAttribute('opacity', '1');
      });

      pieGroup.appendChild(slice);

      // Add label if showLabels is true
      if (this.showLabels && percentage >= 5) {
        // Only show labels for slices >= 5%
        const midAngle = startAngle + angle / 2;
        const labelRadius = this.radius * 0.7; // Position label at 70% of radius
        const labelX = labelRadius * Math.cos(midAngle - Math.PI / 2);
        const labelY = labelRadius * Math.sin(midAngle - Math.PI / 2);

        const label = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        );
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        label.setAttribute('fill', '#fff');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('font-size', '12');

        if (this.showPercentages) {
          label.textContent = `${Math.round(percentage)}%`;
        } else {
          label.textContent = item.label;
        }

        pieGroup.appendChild(label);
      }

      startAngle = endAngle;
    });

    svg.appendChild(pieGroup);

    // Add legend if showLegend is true
    if (this.showLegend) {
      const legendGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      );

      if (this.legendPosition === 'right') {
        legendGroup.setAttribute(
          'transform',
          `translate(${this.width - 120}, 20)`
        );
      } else {
        legendGroup.setAttribute(
          'transform',
          `translate(20, ${this.height - 20 - this.data.length * 25})`
        );
      }

      this.data.forEach((item, index) => {
        const legendItem = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'g'
        );
        legendItem.setAttribute('transform', `translate(0, ${index * 25})`);

        // Color box
        const colorBox = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );
        colorBox.setAttribute('width', '15');
        colorBox.setAttribute('height', '15');
        colorBox.setAttribute('fill', this.colors[index % this.colors.length]);
        legendItem.appendChild(colorBox);

        // Label
        const label = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        );
        label.setAttribute('x', '25');
        label.setAttribute('y', '12');
        label.setAttribute('font-size', '12');

        const percentage = (item.value / total) * 100;
        label.textContent = `${item.label} (${Math.round(percentage)}%)`;

        legendItem.appendChild(label);
        legendGroup.appendChild(legendItem);
      });

      svg.appendChild(legendGroup);
    }

    return svg;
  }
}

export class DonutChart {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 300;
    this.height = options.height || 300;
    this.outerRadius = Math.min(this.width, this.height) / 2 - 40;
    this.innerRadius = this.outerRadius * (options.innerRadiusRatio || 0.6); // Inner hole size
    this.colors = options.colors || ['#3e3eff', '#f44336', '#4caf50', '#ff9800', '#9c27b0'];
    this.showLabels = options.showLabels !== undefined ? options.showLabels : true;
    this.showPercentages = options.showPercentages !== undefined ? options.showPercentages : true;
    this.showLegend = options.showLegend !== undefined ? options.showLegend : true;
    this.showTotal = options.showTotal !== undefined ? options.showTotal : true;
    this.totalLabel = options.totalLabel || 'Total';
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
    
    // Calculate total value
    const total = this.data.reduce((sum, item) => sum + (item.value || 0), 0);
    
    // Create group for the donut chart
    const donutGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    donutGroup.setAttribute('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    
    // Draw donut slices
    let startAngle = 0;
    this.data.forEach((item, index) => {
      if (!item.value || item.value === 0) return; // Skip zero values
      
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * Math.PI * 2;
      const endAngle = startAngle + angle;
      
      // Calculate arc path
      const x1 = this.outerRadius * Math.cos(startAngle - Math.PI / 2);
      const y1 = this.outerRadius * Math.sin(startAngle - Math.PI / 2);
      const x2 = this.outerRadius * Math.cos(endAngle - Math.PI / 2);
      const y2 = this.outerRadius * Math.sin(endAngle - Math.PI / 2);
      
      const ix1 = this.innerRadius * Math.cos(startAngle - Math.PI / 2);
      const iy1 = this.innerRadius * Math.sin(startAngle - Math.PI / 2);
      const ix2 = this.innerRadius * Math.cos(endAngle - Math.PI / 2);
      const iy2 = this.innerRadius * Math.sin(endAngle - Math.PI / 2);
      
      // Create arc path
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      const pathData = [
        `M ${x1} ${y1}`,
        `A ${this.outerRadius} ${this.outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${this.innerRadius} ${this.innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
        'Z'
      ].join(' ');
      
      const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      slice.setAttribute('d', pathData);
      slice.setAttribute('fill', this.colors[index % this.colors.length]);
      slice.setAttribute('stroke', '#fff');
      slice.setAttribute('stroke-width', '1');
      
      // Add hover effect
      slice.setAttribute('class', 'donut-slice');
      slice.addEventListener('mouseover', () => {
        slice.setAttribute('opacity', '0.8');
      });
      slice.addEventListener('mouseout', () => {
        slice.setAttribute('opacity', '1');
      });
      
      donutGroup.appendChild(slice);
      
      // Add label if showLabels is true
      if (this.showLabels && percentage >= 5) { // Only show labels for slices >= 5%
        const midAngle = startAngle + angle / 2;
        const labelRadius = (this.outerRadius + this.innerRadius) / 2; // Position label in the middle of the ring
        const labelX = labelRadius * Math.cos(midAngle - Math.PI / 2);
        const labelY = labelRadius * Math.sin(midAngle - Math.PI / 2);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        label.setAttribute('fill', '#fff');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('font-size', '12');
        
        if (this.showPercentages) {
          label.textContent = `${Math.round(percentage)}%`;
        } else {
          label.textContent = item.label;
        }
        
        donutGroup.appendChild(label);
      }
      
      startAngle = endAngle;
    });
    
    // Add total in the center if showTotal is true
    if (this.showTotal) {
      const totalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      totalText.setAttribute('x', 0);
      totalText.setAttribute('y', -10);
      totalText.setAttribute('text-anchor', 'middle');
      totalText.setAttribute('font-size', '14');
      totalText.setAttribute('font-weight', 'bold');
      totalText.textContent = this.totalLabel;
      
      const totalValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      totalValue.setAttribute('x', 0);
      totalValue.setAttribute('y', 15);
      totalValue.setAttribute('text-anchor', 'middle');
      totalValue.setAttribute('font-size', '18');
      totalValue.setAttribute('font-weight', 'bold');
      totalValue.textContent = total;
      
      donutGroup.appendChild(totalText);
      donutGroup.appendChild(totalValue);
    }
    
    svg.appendChild(donutGroup);
    
    // Add legend
    if (this.showLegend) {
      const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendGroup.setAttribute('transform', `translate(${this.width - 120}, 20)`);
      
      this.data.forEach((item, index) => {
        const legendItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        legendItem.setAttribute('transform', `translate(0, ${index * 25})`);
        
        // Color box
        const colorBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        colorBox.setAttribute('width', '15');
        colorBox.setAttribute('height', '15');
        colorBox.setAttribute('fill', this.colors[index % this.colors.length]);
        legendItem.appendChild(colorBox);
        
        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '25');
        label.setAttribute('y', '12');
        label.setAttribute('font-size', '12');
        
        const percentage = (item.value / total) * 100;
        label.textContent = `${item.label} (${Math.round(percentage)}%)`;
        
        legendItem.appendChild(label);
        legendGroup.appendChild(legendItem);
      });
      
      svg.appendChild(legendGroup);
    }
    
    return svg;
  }
}
