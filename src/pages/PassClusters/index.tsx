import { Col, Row, Segmented, Table } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import MatchResult from 'components/MatchResult';
import SelectMatch, { Match } from 'components/SelectMatch';
import SelectSeason from 'components/SelectSeason';
import * as danfo from 'danfojs';
import Rabona from 'rabonajs';
import { Layer } from 'rabonajs/lib/Layer';
import { Pitch } from 'rabonajs/lib/Pitch';
import { RabonaPitchOptions } from 'rabonajs/lib/Pitch/Pitch';
import React, { useEffect, useRef, useState } from 'react';
import { competitions } from 'utils/competitions';

import styles from './styles.module.scss';

const pitchOptions: RabonaPitchOptions = {
  scaler: 6,
  height: 80,
  width: 120,
  padding: 100,
  linecolour: '#ffffff',
  fillcolour: '#7ec850',
  showArrows: true,
};

type TeamAndEvents = {
  teamName: string;
  teamId: string;
  events: [];
  currentMatch?: Match;
};

const PassClusters = () => {
  const [season, setSeason] = useState({
    competitionId: competitions[0].competition_id.toString(),
    seasonId: competitions[0].season_id.toString(),
  });
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [passersData, setPassersData] = useState<{
    uniquePassersArr: any[];
    allPassesDf?: danfo.DataFrame;
  }>({
    uniquePassersArr: [],
    allPassesDf: undefined,
  });
  const [selectedUser, setSelectedUser] = useState<any>();

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
    const response = await fetch(
      'https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/' +
        _competitionId +
        '/' +
        _seasonId +
        '.json',
    );
    const sampleMatches = await response.json();
    setMatchList(sampleMatches);
  };

  const onSeasonChange = (e: string) => {
    const [competitionId, seasonId] = e.split('/');
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

  const mirror = (val: number, pitch: Pitch) => {
    const a = pitch?.getOptions().width - val;
    return a;
  };

  const createAllPassesData = () => {
    const events = currentTeamAndEvents.events as any;
    const passes = [];

    if (!pitch) {
      return;
    }

    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      if (
        event.type.name === 'Pass' &&
        !!event.pass.recipient?.id &&
        event.team.id == currentTeamAndEvents.teamId
      ) {
        passes.push({
          startX: isAway ? mirror(event.location[0], pitch) : event.location[0],
          startY: event.location[1],
          endX: isAway
            ? mirror(event.pass.end_location[0], pitch)
            : event.pass.end_location[0],
          endY: event.pass.end_location[1],
          length: event.pass.length,
          angle: event.pass.angle,
          passer: event.player?.id,
          passerName: event.player?.name,
          recipient: event.pass.recipient?.id,
          type: event.type.name,
        });
      }
    }

    console.log('passes', passes);

    const df = new danfo.DataFrame(passes);

    const passers = df.groupby(['passer']);

    const passersDf = passers.apply((x) => x);

    const passerNames = passers
      .first()
      .loc({ columns: ['passer', 'passerName'] })
      .setIndex({ column: 'passer' });

    const uniqPassersArr = danfo.toJSON(passerNames) as never[];

    // const uniqPassersObject = uniqPassersArr.reduce((acc, passerVal) => {
    //   const { passer, passerName } = passerVal;
    //   return { ...acc, [passer]: [...(acc[passer] || []), passerName] };
    // }, {});
    console.log(danfo);
    console.log(passers);
    console.log(uniqPassersArr);
    // console.log(uniqPassersObject);

    const usersPasses = passersDf.loc({ rows: passersDf['passer'].eq(3043) });

    console.log(usersPasses);

    setPassersData({
      uniquePassersArr: uniqPassersArr,
      allPassesDf: passersDf,
    });

    // setPassNetworkData(mergedJson);
  };

  useEffect(() => {
    const { competitionId, seasonId } = season;
    if (!pitch) {
      const pitch = Rabona.pitch('pitch', pitchOptions);
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
      createAllPassesData();
    }
  }, [currentTeamAndEvents]);

  useEffect(() => {
    if (selectedUser && passersData.allPassesDf) {
      const usersPasses = passersData.allPassesDf.loc({
        rows: passersData.allPassesDf['passer'].eq(selectedUser),
      });

      console.log(usersPasses);
      const usersPassesJSON = danfo.toJSON(usersPasses) as [];

      if (usersPassesJSON.length && pitch) {
        if (layers?.length) {
          layers.forEach((layer) => {
            layer.remove();
          });
        }
        const newLayers: Layer[] = [];
        usersPassesJSON.forEach((pass: any) => {
          const layer = Rabona.layer({
            type: 'line',
            data: [pass],
            options: { color: 'yellow', width: 1 },
          }).addTo(pitch);
          newLayers.push(layer);
        });
        setLayers(newLayers);
      }
    }
  }, [selectedUser]);

  const { currentMatch } = currentTeamAndEvents;

  interface DataType {
    key: React.Key;
    passer: string;
    passerName: string;
  }

  const columns = [
    {
      title: 'Player',
      dataIndex: 'passerName',
      key: 'passerName',
    },
    {
      title: 'Player',
      dataIndex: 'passer',
      key: 'passer',
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedUser(selectedRowKeys[0]);
    },
  };

  return (
    <div className={styles.PassNetworks}>
      <div className={styles.Header}>
        <SelectSeason handleChange={onSeasonChange} />
        {matchList.length && (
          <SelectMatch
            options={matchList}
            handleChange={onMatchChange}
            defaultValue={matchList[0]}
          />
        )}
      </div>
      <MatchResult
        awayTeamName={currentMatch?.away_team.away_team_name}
        homeTeamName={currentMatch?.home_team.home_team_name}
        awayTeamScore={currentMatch?.away_score}
        homeTeamScore={currentMatch?.home_score}
        matchDate={currentMatch?.match_date}
        stadiumName={currentMatch?.stadium.name}
      />
      <div className={styles.Title}>
        <span>Pass Clusters</span>
        <Segmented
          options={['Home', 'Away']}
          onChange={onCurrentTeamSelected}
          style={{ textAlign: 'center' }}
        />
      </div>

      <Row>
        <Col span={12}>
          <Table
            dataSource={passersData.uniquePassersArr}
            columns={columns}
            size="small"
            rowSelection={{
              type: 'radio',
              ...rowSelection,
            }}
            rowKey={(record) => record.passer}
          ></Table>
        </Col>
        <Col span={12}>
          <div id="pitch" ref={pitchRef} style={{ margin: 'auto' }} />
        </Col>
      </Row>
    </div>
  );
};

export default PassClusters;
