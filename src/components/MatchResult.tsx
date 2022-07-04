import './MatchResult.scss';

import { Typography } from 'antd';
import React from 'react';

type MatchResultProps = {
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  matchDate?: string;
  stadiumName?: string;
};
const { Text, Title } = Typography;

const MatchResult: React.FC<MatchResultProps> = ({
  homeTeamName,
  homeTeamScore,
  awayTeamName,
  awayTeamScore,
  matchDate,
  stadiumName,
}) => {
  return (
    <div className="MatchResult">
      <p>{stadiumName}</p>
      <p>{matchDate}</p>
      <div className="matchInfo">
        <p className="teamName">{homeTeamName}</p>
        <div className="score">
          <span>{homeTeamScore}</span>-<span>{awayTeamScore}</span>
        </div>
        <p className="teamName">{awayTeamName}</p>
      </div>
    </div>
  );
};

export default MatchResult;
