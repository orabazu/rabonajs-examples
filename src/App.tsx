import './App.css';

import SelectSeason from 'components/SelectSeason';
import * as d3 from 'd3';
import Rabona from 'rabona';
import { Layer } from 'rabona/lib/Layer';
import { Pitch } from 'rabona/lib/Pitch';
import React, { useEffect, useRef, useState } from 'react';

const pitchOptions = {
  scaler: 6,
  height: 80,
  width: 120,
  padding: 100,
  linecolour: '#ffffff',
  fillcolour: '#7ec850',
};

function App() {
  const [matchData, setMatchData] = useState([]);

  const [game, setGame] = useState({
    competitionId: '',
    seasonId: '',
  });

  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [layer, setLayer] = useState<Layer | null>(null);

  const pitchRef = useRef<HTMLDivElement>(null);

  const getData = async (competitionId = `43`, seasonId = `3`) => {
    // const competitionId = 43;
    // const seasonId = 3;
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
      // .slice(0, 100)
      .filter((event: any) => event.type.name === 'Pass')
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
    console.log(pitch);
    if (matchData.length && pitch) {
      const passes = Rabona.layer({
        type: 'line',
        data: matchData,
        options: { color: 'yellow' },
      }).addTo(pitch);

      setLayer(passes);

      console.log(passes);
    }
  }, [matchData]);

  useEffect(() => {
    const pitch = Rabona.pitch('pitch', pitchOptions);
    setPitch(pitch);
    getData();
  }, []);

  useEffect(() => {
    const { competitionId, seasonId } = game;
    layer?.remove();
    getData(competitionId, seasonId);
  }, [game]);

  const onChange = (e: string) => {
    const [competitionId, seasonId] = e.split('/');
    console.log([competitionId, seasonId]);
    setGame({
      competitionId,
      seasonId,
    });
  };

  return (
    <div className="App">
      <SelectSeason handleChange={onChange} />
      <div id="pitch" ref={pitchRef} />
    </div>
  );
}

export default App;
