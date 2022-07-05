import './App.scss';

import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import MatchResult from 'components/MatchResult';
import SelectMatch, { Match } from 'components/SelectMatch';
import SelectSeason from 'components/SelectSeason';
import * as danfo from 'danfojs';
import Rabona from 'rabona';
import { Layer } from 'rabona/lib/Layer';
import { Pitch } from 'rabona/lib/Pitch';
import { RabonaPitchOptions } from 'rabona/lib/Pitch/Pitch';
import React, { useEffect, useRef, useState } from 'react';
import { competitions } from 'utils/competitions';

const pitchOptions: RabonaPitchOptions = {
  scaler: 6,
  height: 80,
  width: 120,
  padding: 100,
  linecolour: '#ffffff',
  fillcolour: '#7ec850',
  showArrows: false,
};

type TeamAndEvents = {
  teamName: string;
  teamId: string;
  events: [];
  currentMatch?: Match;
};

function App() {
  const [season, setSeason] = useState({
    competitionId: competitions[0].competition_id.toString(),
    seasonId: competitions[0].season_id.toString(),
  });
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [passNetworkData, setPassNetworkData] = useState<any[]>([]);
  const [currentTeamAndEvents, setCurrentTeamAndEvents] = useState<TeamAndEvents>({
    teamName: '',
    teamId: '',
    events: [],
    currentMatch: undefined,
  });
  const [isAway, setIsAway] = useState(false);

  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);

  const pitchRef = useRef<HTMLDivElement>(null);

  const getData = async (competitionId: string, seasonId: string) => {
    const _competitionId = competitionId || competitions[0].competition_id;
    const _seasonId = seasonId || competitions[0].season_id;
    console.log(`competitionId: ${competitionId}`);
    const response = await fetch(
      'https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/' +
        _competitionId +
        '/' +
        _seasonId +
        '.json',
    );
    const sampleMatches = await response.json();
    console.log(sampleMatches);
    setMatchList(sampleMatches);
  };

  const onSeasonChange = (e: string) => {
    const [competitionId, seasonId] = e.split('/');
    console.log([competitionId, seasonId]);
    setSeason({
      competitionId,
      seasonId,
    });
  };

  const onMatchChange = async (matchId: number) => {
    const eventsResponse = await fetch(
      'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/' +
        matchId +
        '.json',
    );
    const events = await eventsResponse.json();
    const currentMatch = matchList.find((match) => match.match_id === matchId);
    if (!currentMatch) {
      return;
    }
    setCurrentTeamAndEvents({
      teamName: currentMatch.home_team.home_team_name,
      teamId: currentMatch.home_team.home_team_id.toString(),
      events,
      currentMatch,
    });
  };

  const onCurrentTeamSelected = (val: SegmentedValue) => {
    if (!currentTeamAndEvents.currentMatch) {
      return;
    }
    console.log(val, currentTeamAndEvents.currentMatch);
    const teamName =
      val === 'Home'
        ? currentTeamAndEvents.currentMatch?.home_team.home_team_name
        : currentTeamAndEvents.currentMatch?.away_team.away_team_name;
    const teamId =
      val === 'Home'
        ? currentTeamAndEvents.currentMatch?.home_team.home_team_id
        : currentTeamAndEvents.currentMatch?.away_team.away_team_id;

    setIsAway(val === 'Away');
    setCurrentTeamAndEvents({
      teamName,
      teamId: teamId.toString(),
      events: currentTeamAndEvents.events,
      currentMatch: currentTeamAndEvents.currentMatch,
    });
  };

  const createPassNetworkData = () => {
    const events = currentTeamAndEvents.events as any;
    const passes = [];

    if (!pitch) {
      return;
    }

    const mirror = (val: number) => {
      const a = pitch?.getOptions().width - val;
      console.log(a);
      return a;
    };

    // get all passNetworkData before the first sub
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      if (
        event.type.name === 'Pass' &&
        !!event.pass.recipient?.id &&
        event.team.id == currentTeamAndEvents.teamId
      ) {
        passes.push({
          startX: isAway ? mirror(event.location[0]) : event.location[0],
          startY: event.location[1],
          endX: isAway ? mirror(event.pass.end_location[0]) : event.pass.end_location[0],
          endY: event.pass.end_location[1],
          length: event.pass.length,
          angle: event.pass.angle,
          passer: event.player?.id,
          recipient: event.pass.recipient?.id,
          type: event.type.name,
        });
      } else if (event.type.name === 'Substitution') {
        break;
      }
    }

    console.log(passes);
    const df = new danfo.DataFrame(passes);
    console.log(df);
    console.log(danfo);

    const avereagePositions = df
      .groupby(['passer'])
      .agg({ startX: 'mean', startY: ['mean', 'count'] })
      .rename({ startY_count: 'pass_count' });

    const passBetween = df
      .groupby(['passer', 'recipient'])
      .agg({ startY: ['count'] })
      .rename({ startY_count: 'count' });

    const merged = danfo.merge({
      left: passBetween,
      right: avereagePositions,
      on: ['passer'],
      how: 'left',
    });

    let mergedJson = danfo.toJSON(merged) as any[];
    const averagePositionsJSON = danfo.toJSON(avereagePositions) as any[];
    console.log('averagePositionsJSON :', averagePositionsJSON);
    console.log(mergedJson);

    mergedJson = mergedJson.map((j) => ({
      endX: averagePositionsJSON.find((a) => j.recipient === a.passer).startX_mean,
      endY: averagePositionsJSON.find((a) => j.recipient === a.passer).startY_mean,
      startX: j.startX_mean,
      startY: j.startY_mean,
      ...j,
    }));

    console.log('mergedJson :', mergedJson);

    setPassNetworkData(mergedJson);
  };

  const norm = (val: number, max = 2, min = 0) => {
    return (val - min) / (max - min);
  };

  // useEffect(() => {
  //   const pitch = Rabona.pitch('pitch', pitchOptions);
  //   setPitch(pitch);
  //   getData();
  // }, []);

  useEffect(() => {
    const { competitionId, seasonId } = season;
    if (!pitch) {
      const pitch = Rabona.pitch('pitch', pitchOptions);
      console.log(pitch);
      setPitch(pitch);
    }

    getData(competitionId, seasonId);
  }, [season]);

  useEffect(() => {
    if (matchList.length) {
      onMatchChange(matchList[0].match_id);
    }
  }, [matchList]);

  useEffect(() => {
    const { teamId, events } = currentTeamAndEvents;
    if (teamId.length && events.length) {
      createPassNetworkData();
    }
  }, [currentTeamAndEvents]);

  useEffect(() => {
    if (passNetworkData.length && pitch) {
      if (layers?.length) {
        layers.forEach((layer) => {
          layer.remove();
        });
      }
      const newLayers: Layer[] = [];
      passNetworkData.forEach((pass: any) => {
        const layer = Rabona.layer({
          type: 'line',
          data: [pass],
          options: { color: 'yellow', width: norm(pass?.count) },
        }).addTo(pitch);
        newLayers.push(layer);
      });
      setLayers(newLayers);
    }
  }, [passNetworkData]);

  const { currentMatch } = currentTeamAndEvents;

  return (
    <div className="App">
      <div className="Header">
        <SelectSeason handleChange={onSeasonChange} />
        {matchList.length && (
          <SelectMatch
            options={matchList}
            handleChange={onMatchChange}
            defaultValue={matchList[0]}
          />
        )}
      </div>
      <div className="Game">
        <MatchResult
          awayTeamName={currentMatch?.away_team.away_team_name}
          homeTeamName={currentMatch?.home_team.home_team_name}
          awayTeamScore={currentMatch?.away_score}
          homeTeamScore={currentMatch?.home_score}
          matchDate={currentMatch?.match_date}
          stadiumName={currentMatch?.stadium.name}
        />
      </div>
      <div className="Title">
        <span>Passing Network</span>
        <Segmented
          options={['Home', 'Away']}
          onChange={onCurrentTeamSelected}
          style={{ textAlign: 'center' }}
        />
      </div>

      <div id="pitch" ref={pitchRef} style={{ width: '550px', margin: 'auto' }} />
    </div>
  );
}

export default App;
