/* ============================================================
   PPI GUIDEBOOK — NETWORK VISUALISATION (D3 v7)
   ============================================================ */

(function () {
  'use strict';

  // ── Hero Network (landing page animated background) ───────
  function initHeroNetwork(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const W = container.offsetWidth;
    const H = container.offsetHeight;

    // Key neuro proteins + interactors
    const nodes = [
      // Hub proteins (larger)
      { id: 'APP',   label: 'APP',   type: 'hub',    r: 18, info: 'Amyloid Precursor Protein — central to Alzheimer\'s disease research' },
      { id: 'MAPT',  label: 'MAPT',  type: 'hub',    r: 16, info: 'Microtubule-Associated Protein Tau — forms tangles in neurodegeneration' },
      { id: 'SNCA',  label: 'SNCA',  type: 'hub',    r: 16, info: 'α-Synuclein — aggregates in Parkinson\'s disease' },
      { id: 'TP53',  label: 'TP53',  type: 'hub',    r: 15, info: 'Tumour Suppressor p53 — guardian of the genome' },
      { id: 'PSEN1', label: 'PSEN1', type: 'med',    r: 12, info: 'Presenilin-1 — processes APP, mutations cause early-onset AD' },
      // Interactors
      { id: 'BACE1', label: 'BACE1', type: 'med',    r: 11, info: 'Beta-secretase 1 — cleaves APP to produce amyloid-β' },
      { id: 'CLU',   label: 'CLU',   type: 'small',  r: 9,  info: 'Clusterin — chaperone, AD risk locus' },
      { id: 'BIN1',  label: 'BIN1',  type: 'small',  r: 9,  info: 'Bridging Integrator 1 — major AD GWAS hit' },
      { id: 'APOE',  label: 'APOE',  type: 'med',    r: 12, info: 'Apolipoprotein E — strongest genetic risk factor for late-onset AD' },
      { id: 'PARK2', label: 'PARK2', type: 'small',  r: 9,  info: 'Parkin — E3 ubiquitin ligase, mutated in familial PD' },
      { id: 'LRRK2', label: 'LRRK2', type: 'med',    r: 12, info: 'Leucine-rich repeat kinase 2 — most common genetic PD cause' },
      { id: 'PINK1', label: 'PINK1', type: 'small',  r: 9,  info: 'PTEN-induced kinase 1 — mitophagy regulator' },
      { id: 'CDK5',  label: 'CDK5',  type: 'small',  r: 9,  info: 'Cyclin-dependent kinase 5 — phosphorylates tau' },
      { id: 'GSK3B', label: 'GSK3β', type: 'med',    r: 11, info: 'Glycogen Synthase Kinase 3β — major tau kinase' },
      { id: 'BDNF',  label: 'BDNF',  type: 'small',  r: 9,  info: 'Brain-Derived Neurotrophic Factor — neuronal survival' },
      { id: 'NTRK2', label: 'TrkB',  type: 'small',  r: 8,  info: 'BDNF receptor — mediates neurotrophin signalling' },
    ];

    const links = [
      { source: 'APP',   target: 'PSEN1', score: 0.98 },
      { source: 'APP',   target: 'BACE1', score: 0.97 },
      { source: 'APP',   target: 'APOE',  score: 0.85 },
      { source: 'APP',   target: 'CLU',   score: 0.72 },
      { source: 'APP',   target: 'BIN1',  score: 0.68 },
      { source: 'MAPT',  target: 'CDK5',  score: 0.95 },
      { source: 'MAPT',  target: 'GSK3B', score: 0.96 },
      { source: 'MAPT',  target: 'APP',   score: 0.78 },
      { source: 'MAPT',  target: 'PSEN1', score: 0.71 },
      { source: 'SNCA',  target: 'PARK2', score: 0.92 },
      { source: 'SNCA',  target: 'LRRK2', score: 0.89 },
      { source: 'SNCA',  target: 'PINK1', score: 0.88 },
      { source: 'LRRK2', target: 'PARK2', score: 0.85 },
      { source: 'PARK2', target: 'PINK1', score: 0.94 },
      { source: 'TP53',  target: 'CDK5',  score: 0.75 },
      { source: 'TP53',  target: 'APP',   score: 0.62 },
      { source: 'BDNF',  target: 'NTRK2', score: 0.99 },
      { source: 'GSK3B', target: 'TP53',  score: 0.71 },
      { source: 'APOE',  target: 'CLU',   score: 0.65 },
      { source: 'CDK5',  target: 'SNCA',  score: 0.74 },
    ];

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'visible');

    // Defs: glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const hubFilter = defs.append('filter').attr('id', 'hub-glow');
    hubFilter.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
    const feMerge2 = hubFilter.append('feMerge');
    feMerge2.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge2.append('feMergeNode').attr('in', 'SourceGraphic');

    // Colour scale by type
    const colorMap = { hub: '#00c9a7', med: '#4a9eff', small: '#a78bfa' };

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id)
        .distance(d => 80 + (1 - d.score) * 60)
        .strength(d => d.score * 0.8))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(d => d.r + 20));

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => `rgba(0,201,167,${d.score * 0.4})`)
      .attr('stroke-width', d => d.score * 2)
      .style('opacity', 0);

    // Node groups
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'ppi-node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Outer glow ring for hubs
    node.filter(d => d.type === 'hub')
      .append('circle')
      .attr('r', d => d.r + 8)
      .attr('fill', 'none')
      .attr('stroke', d => colorMap[d.type])
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    // Main circles
    node.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => {
        if (d.type === 'hub') return 'rgba(0,201,167,0.15)';
        if (d.type === 'med') return 'rgba(74,158,255,0.1)';
        return 'rgba(167,139,250,0.1)';
      })
      .attr('stroke', d => colorMap[d.type])
      .attr('stroke-width', d => d.type === 'hub' ? 2 : 1.5)
      .attr('filter', d => d.type === 'hub' ? 'url(#hub-glow)' : 'url(#glow)')
      .style('opacity', 0)
      .transition().delay((d, i) => i * 80).duration(600)
      .style('opacity', 1);

    // Labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-family', "'DM Mono', monospace")
      .attr('font-size', d => d.type === 'hub' ? '9px' : '7.5px')
      .attr('font-weight', d => d.type === 'hub' ? '500' : '400')
      .attr('fill', d => colorMap[d.type])
      .attr('pointer-events', 'none')
      .text(d => d.label)
      .style('opacity', 0)
      .transition().delay((d, i) => i * 80 + 200).duration(600)
      .style('opacity', 1);

    // Tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'network-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(13,22,40,0.95)')
      .style('border', '1px solid rgba(0,201,167,0.3)')
      .style('border-radius', '10px')
      .style('padding', '0.75rem 1rem')
      .style('font-size', '0.8rem')
      .style('color', '#8fa3c8')
      .style('max-width', '220px')
      .style('line-height', '1.5')
      .style('pointer-events', 'none')
      .style('opacity', '0')
      .style('transition', 'opacity 0.2s')
      .style('z-index', '10');

    node.on('mouseenter', (event, d) => {
      tooltip
        .html(`<strong style="color:#e8edf7;font-family:'Syne',sans-serif;">${d.label}</strong><br>${d.info}`)
        .style('opacity', '1');
      d3.select(event.currentTarget).select('circle:last-of-type')
        .transition().duration(200)
        .attr('r', d.r + 3);
    })
    .on('mousemove', (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left + 12;
      const y = event.clientY - rect.top - 10;
      tooltip.style('left', x + 'px').style('top', y + 'px');
    })
    .on('mouseleave', (event, d) => {
      tooltip.style('opacity', '0');
      d3.select(event.currentTarget).select('circle:last-of-type')
        .transition().duration(200)
        .attr('r', d.r);
    });

    // Animate links in
    setTimeout(() => {
      link.transition().duration(800).style('opacity', 1);
    }, 1200);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x; d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x; d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null; d.fy = null;
    }

    // Resize
    window.addEventListener('resize', () => {
      const nw = container.offsetWidth;
      const nh = container.offsetHeight;
      svg.attr('viewBox', `0 0 ${nw} ${nh}`);
      simulation.force('center', d3.forceCenter(nw / 2, nh / 2));
      simulation.alpha(0.3).restart();
    });
  }

  // ── Degree distribution mini-chart for basics page ────────
  function initDegreeChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const W = container.offsetWidth || 400;
    const H = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Scale-free distribution data
    const data = [
      { degree: 1, count: 48 },
      { degree: 2, count: 31 },
      { degree: 3, count: 19 },
      { degree: 4, count: 13 },
      { degree: 5, count: 9 },
      { degree: 7, count: 6 },
      { degree: 10, count: 4 },
      { degree: 15, count: 2 },
      { degree: 25, count: 1 },
    ];

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`);

    const x = d3.scaleLinear()
      .domain([0, 26])
      .range([margin.left, W - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 52])
      .range([H - margin.bottom, margin.top]);

    // Area fill
    const area = d3.area()
      .x(d => x(d.degree))
      .y0(H - margin.bottom)
      .y1(d => y(d.count))
      .curve(d3.curveCatmullRom);

    svg.append('path')
      .datum(data)
      .attr('fill', 'rgba(0,201,167,0.1)')
      .attr('d', area);

    // Line
    const line = d3.line()
      .x(d => x(d.degree))
      .y(d => y(d.count))
      .curve(d3.curveCatmullRom);

    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#00c9a7')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animate line draw
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition().duration(1500).ease(d3.easeCubicInOut)
      .attr('stroke-dashoffset', 0);

    // Dots
    svg.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.degree))
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', '#00c9a7')
      .attr('stroke', '#080e1c')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition().delay(1400).duration(400)
      .style('opacity', 1);

    // X-axis label
    svg.append('text')
      .attr('x', W / 2)
      .attr('y', H - 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#4a6080')
      .attr('font-family', "'DM Mono', monospace")
      .text('Number of interaction partners (degree)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(H / 2))
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#4a6080')
      .attr('font-family', "'DM Mono', monospace")
      .text('# proteins');
  }

  // ── Export ────────────────────────────────────────────────
  window.PPINetwork = {
    initHeroNetwork,
    initDegreeChart,
  };

})();
