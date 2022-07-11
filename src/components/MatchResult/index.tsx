import { Typography } from 'antd';
import React from 'react';

import styles from './styles.module.scss';

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
    <div className={styles.MatchResult}>
      <p>{stadiumName}</p>
      <p>{matchDate}</p>
      <div className={styles.matchInfo}>
        <p className={styles.teamName}>{homeTeamName}</p>
        <div className={styles.score}>
          <span>{homeTeamScore}</span>-<span>{awayTeamScore}</span>
        </div>
        <p className={styles.teamName}>{awayTeamName}</p>
      </div>
    </div>
  );
};

export default MatchResult;
