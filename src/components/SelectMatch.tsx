import { Select } from 'antd';
import { BaseOptionType } from 'antd/lib/select';
import React from 'react';
const { Option } = Select;

export type Match = {
  match_id: number;
  home_team: {
    home_team_id: number;
    home_team_name: string;
  };
  away_team: {
    away_team_id: number;
    away_team_name: string;
  };
  home_score: number;
  away_score: number;
  match_date: string;
  stadium: {
    name: string;
  };
};

type Props = {
  handleChange: (value: number, option: BaseOptionType) => void;
  options: Match[];
  defaultValue: Match;
};
const SelectMatch: React.FC<Props> = ({ handleChange, options, defaultValue }) => {
  console.log(options, defaultValue);
  return (
    <>
      <Select
        defaultValue={defaultValue.match_id}
        onChange={handleChange}
        style={{ width: 240 }}
      >
        {options.map((match) => (
          <Option value={match.match_id} key={match.match_id}>
            {match.home_team.home_team_name} ({match.home_score} -{match.away_score})
            {match.away_team.away_team_name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default SelectMatch;
