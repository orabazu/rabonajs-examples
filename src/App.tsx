import './App.css';
import Rabona from './Rabona';

import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

const pitchOptions = {
  scaler: 6,
  height: 80,
  width: 120,
  padding: 100,
  linecolour: '#ffffff',
  fillcolour: '#7ec850',
};

// const sixYardBox = {
//   width: 6,
//   heigth: 20,
//   top: 30,
// };

// const penaltyBox = {
//   width: 18,
//   heigth: 44,
//   top: 18,
// };

// const goal = {
//   width: 3,
//   heigth: 8,
//   top: 36,
// };

// const sizes = {
//   width: pitchOptions.width * pitchOptions.scaler,
//   height: pitchOptions.height * pitchOptions.scaler,
//   sixYardBoxWidth: sixYardBox.width * pitchOptions.scaler,
//   sixYardBoxHeight: sixYardBox.heigth * pitchOptions.scaler,
//   sixYardBoxTop: sixYardBox.top * pitchOptions.scaler,
//   penaltyBoxWidth: penaltyBox.width * pitchOptions.scaler,
//   penaltyBoxHeigth: penaltyBox.heigth * pitchOptions.scaler,
//   penaltyBoxTop: penaltyBox.top * pitchOptions.scaler,
//   goalBoxWidth: goal.width * pitchOptions.scaler,
//   goalBoxHeigth: goal.heigth * pitchOptions.scaler,
//   goalBoxTop: goal.top * pitchOptions.scaler,
// };

// const drawPitch = (
//   // pitchRef: React.RefObject<HTMLDivElement>,
//   pitchSelector: string,
//   pitchOptions: any,
//   sizes: any,
// ) => {
//   function handleZoom(e: any) {
//     d3.select('svg g').attr('transform', e.transform);
//   }
//   let zoom = d3.zoom().on('zoom', handleZoom);

//   const svg = d3
//     .select(`#${pitchSelector}`)
//     .append('svg')
//     .attr('width', sizes.width + pitchOptions.padding)
//     .attr('height', sizes.height + pitchOptions.padding);

//   svg
//     .append('rect')
//     .attr('x', 0) // position the left of the rectangle
//     .attr('y', 0) // position the top of the rectangle
//     .attr('width', sizes.width + pitchOptions.padding)
//     .attr('height', sizes.height + pitchOptions.padding)
//     .style('fill', pitchOptions.fillcolour);

//   // draw a rectangle pitch outline
//   svg
//     .append('rect') // attach a rectangle
//     .attr('x', 50) // position the left of the rectangle
//     .attr('y', 50) // position the top of the rectangle
//     .attr('height', sizes.height) // set the height
//     .attr('width', sizes.width) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // draw a rectangle - half 1
//   svg
//     .append('rect') // attach a rectangle
//     .attr('x', sizes.width / 2 + pitchOptions.padding - 50) // position the left of the rectangle
//     .attr('y', 50) // position the top of the rectangle
//     .attr('height', sizes.height) // set the height
//     .attr('width', sizes.width / 2) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // middle circle
//   svg
//     .append('circle') // attach a circle
//     .attr('cx', sizes.width / 2 + pitchOptions.padding - 50) // position the x-centre
//     .attr('cy', sizes.height / 2 + 50) // position the y-centre
//     .attr('r', 60) // set the radius
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // six yard box
//   svg
//     .append('rect') // attach a rectangle
//     .attr('x', 50) // position the left of the rectangle
//     .attr('y', sizes.sixYardBoxTop + 50) // position the top of the rectangle
//     .attr('height', sizes.sixYardBoxHeight) // set the height
//     .attr('width', sizes.sixYardBoxWidth) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // penalty box
//   svg
//     .append('rect')
//     .attr('x', 50) // position the left of the rectangle
//     .attr('y', sizes.penaltyBoxTop + 50) // position the top of the rectangle
//     .attr('height', sizes.penaltyBoxHeigth) // set the height
//     .attr('width', sizes.penaltyBoxWidth) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // six yard box2
//   svg
//     .append('rect') // attach a rectangle
//     .attr('x', sizes.width + 14) // position the left of the rectangle
//     .attr('y', sizes.sixYardBoxTop + 50) // position the top of the rectangle
//     .attr('height', sizes.sixYardBoxHeight) // set the height
//     .attr('width', sizes.sixYardBoxWidth) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // penalty box 2
//   svg
//     .append('rect')
//     .attr('x', sizes.width - 58) // position the left of the rectangle
//     .attr('y', sizes.penaltyBoxTop + 50) // position the top of the rectangle
//     .attr('height', sizes.penaltyBoxHeigth) // set the height
//     .attr('width', sizes.penaltyBoxWidth) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // goal 1
//   svg
//     .append('rect')
//     .attr('x', 25 + 6) // position the left of the rectangle
//     .attr('y', sizes.goalBoxTop + 50) // position the top of the rectangle
//     .attr('height', sizes.goalBoxHeigth) // set the height
//     .attr('width', sizes.goalBoxWidth) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   // goal 2
//   svg
//     .append('rect')
//     .attr('x', sizes.width + 50) // position the left of the rectangle
//     .attr('y', sizes.goalBoxTop + 50) // position the top of the rectangle
//     .attr('height', sizes.goalBoxHeigth) // set the height
//     .attr('width', sizes.goalBoxWidth) // set the width
//     .style('stroke-width', 5) // set the stroke width
//     .style('stroke', pitchOptions.linecolour) // set the line colour
//     .style('fill', 'none'); // set the fill colour

//   svg.call(d3.zoom().on('zoom', zoomed));

//   function zoomed({ transform }) {
//     svg.attr('transform', transform);
//   }

//   return svg;
// };

// const drawPasses = (pitchRef: React.RefObject<HTMLDivElement>, matchData: any) => {
//   let svg = d3.select(pitchRef.current);
//   for (const pass of matchData) {
//     svg
//       .append('line')
//       .style('stroke', 'magenta')
//       .style('stroke-width', 1.2)
//       .attr('x1', pass.startX * pitchOptions.scaler + 50)
//       .attr('y1', pass.startY * pitchOptions.scaler + 50)
//       .attr('x2', pass.endX * pitchOptions.scaler + 50)
//       .attr('y2', pass.endY * pitchOptions.scaler + 50);
//     // .attr('marker-end');
//   }
// };

function App() {
  const [matchData, setMatchData] = useState([]);
  const pitchRef = useRef<HTMLDivElement>(null);

  const getData = async () => {
    const competitionId = 43;
    const seasonId = 3;
    const response = await fetch(
      'https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/' +
        competitionId +
        '/' +
        seasonId +
        '.json',
    );
    const sampleMatches = await response.json();
    const passResponse = await fetch(
      'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/' +
        sampleMatches[1].match_id +
        '.json',
    );
    const passes = await passResponse.json();
    const filteredPasses = passes
      .filter((event: any) => event.type.name === 'Pass' && event.team.id === 791)
      .map((pass: any) => ({
        startX: pass.location[0],
        startY: pass.location[1],
        endX: pass.pass.end_location[0],
        endY: pass.pass.end_location[1],
        length: pass.pass.length,
        angle: pass.pass.angle,
      }));
    setMatchData(filteredPasses);
  };

  useEffect(() => {
    // d3.select(pitchRef.current).append('p').text('Hello from D3');
    if (matchData.length) {
      let pitch = Rabona.pitch('pitch', pitchOptions);
      let passes = Rabona.layer({
        type: 'pass',
        data: matchData,
        options: {},
      }).addTo(pitch);

      console.log(passes);
    }
  }, [matchData]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <div id="pitch" ref={pitchRef} />
    </div>
  );
}

export default App;
